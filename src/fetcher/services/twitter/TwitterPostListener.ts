import Twit, { Stream } from 'twit';
import { TwitterPost, TwitterDeleteInfo } from './TwitterModels';
import { PolitEmbedType } from '../../../models';
import { PolitPostListenerBase, PolitPostListenerState } from '../../PolitPostListenerBase';
import { PolitContext } from '../../PolitContext';
import { Post } from '../../entities/Post';
import { User } from '../../entities/User';

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
    console.log(this.fetchedUsers);
    if (this.fetchedUsers.length) {
      this.state = PolitPostListenerState.STARTING;
      this.stream = this.client.stream(
        'statuses/filter', { follow: this.fetchedUsers.map(u => u.externalId).join(',') });
      this.stream.on('tweet', (tweet: TwitterPost) => {
        console.log(JSON.stringify(tweet));
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
            post.author = user.id;
            post.content = tweet.text;
            post.createTimestamp = parseInt(tweet.timestamp_ms, 10);
            post.deleted = false;
            post.embeds = tweet.entities.media ? tweet.entities.media.map(e => ({
              type: PolitEmbedType.IMAGE,
              url: e.media_url_https,
            })) : [];
            post.externalId = tweet.id_str;

            this.context.listenerApi.savePost(post);
          }
        }
      });
      this.stream.on('delete', (deleteInfo: TwitterDeleteInfo) => {
        console.log(deleteInfo);
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
