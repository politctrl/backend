import log from 'consola';
import Twit, { Stream } from 'twit';
import { TwitterPost, TwitterDeleteInfo } from './TwitterModels';
import { PolitEmbedType } from '../../../models';
import { PolitPostListenerBase, PolitPostListenerState } from '../../PolitPostListenerBase';
import { PolitContext } from '../../../PolitContext';
import { Post } from '../../../entities/Post';
import { User } from '../../../entities/User';
import { Embed } from '../../../entities/Embed';

export default class TwitterListener extends PolitPostListenerBase {
  client: Twit;
  fetchedUsers: User[];
  stream?: Stream;
  serviceName: string = 'twitter';

  constructor(context: PolitContext) {
    super(context);
    if (!process.env.TWITTER_CONSUMER_KEY
      || !process.env.TWITTER_CONSUMER_SECRET
      || !process.env.TWITTER_ACCESS_TOKEN
      || !process.env.TWITTER_ACCESS_TOKEN_SECRET) {
      throw new Error('Twitter keys missing in .env');
    }
    this.client = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      strictSSL: true,
    });
    this.fetchedUsers = [];
  }

  async start() {
    log.debug(this.fetchedUsers);
    if (this.fetchedUsers.length) {
      this.state = PolitPostListenerState.STARTING;
      this.stream = this.client.stream(
        'statuses/filter', { follow: this.fetchedUsers.map(u => u.externalId).join(',') });
      this.stream.on('tweet', (tweet: TwitterPost) => {
        log.debug(JSON.stringify(tweet));
        /*
          some of tweets showed here are just mentioning the followed person
          and we shouldn't archive them because:
          A. they're not made by public persons
          B. it's just spammy and not interesing
        */
        const user = this.fetchedUsers.find(u => u.externalId === tweet.user.id_str);
        if (user) {
          if (this.context.listenerApi) {
            const post = new Post();
            post.author = user;
            post.createTimestamp = parseInt(tweet.timestamp_ms, 10);
            post.deleted = false;
            post.externalId = tweet.id_str;
            post.service = this.serviceName;
            post.replyToId = tweet.in_reply_to_status_id_str;

            post.embeds = [];
            if (tweet.entities.media) {
              tweet.entities.media.forEach((e) => {
                const embed = new Embed();
                embed.type = PolitEmbedType.IMAGE;
                if (e.type === 'animated_gif') {
                  embed.type = PolitEmbedType.GIF;
                } else if (e.type === 'video') {
                  embed.type = PolitEmbedType.VIDEO;
                }
                embed.url = e.media_url_https;
              });
            }

            post.content = '';
            if (tweet.extended_tweet) {
              post.content = tweet.extended_tweet.full_text;
            } else if (tweet.retweeted_status) {
              post.content += `RT @${tweet.retweeted_status.user.screen_name}: `;
              if (tweet.retweeted_status.extended_tweet) {
                post.content += tweet.retweeted_status.extended_tweet.full_text;
              } else {
                post.content += tweet.retweeted_status.text;
              }
            } else {
              post.content = tweet.text;
            }
            if (tweet.quoted_status) {
              if (tweet.retweeted_status) {
                post.content += '\n';
              }
              post.content += `Quoting @${tweet.quoted_status.user.screen_name}: `;
              if (tweet.quoted_status.extended_tweet) {
                post.content += tweet.quoted_status.extended_tweet.full_text;
              } else {
                post.content += tweet.quoted_status.text;
              }
            }

            this.context.listenerApi.savePost(post);
          }
        }
      });
      this.stream.on('delete', (deleteInfo: TwitterDeleteInfo) => {
        log.debug(deleteInfo);
        this.context.listenerApi.savePostDeleteInfo(
          deleteInfo.delete.status.id_str, parseInt(deleteInfo.delete.timestamp_ms, 10));
      });
      this.state = PolitPostListenerState.RUNNING;
    } else {
      this.state = PolitPostListenerState.BROKEN;
    }
  }

  async stop() {
    if (this.stream) {
      this.stream.stop();
    }
    this.state = PolitPostListenerState.STOPPED;
  }

}
