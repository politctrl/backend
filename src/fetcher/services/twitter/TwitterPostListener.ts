import Twit, { Stream } from 'twit';
import { TwitterPost, TwitterDeleteInfo } from './TwitterModels';
import { PolitPost, PolitEmbed, PolitEmbedType, PolitUser } from '../../../models';
import { PolitPostListenerBase } from '../../PolitPostListenerBase';
import { PolitContext } from '../../PolitContext';

export default class TwitterListener extends PolitPostListenerBase {
  client: Twit;
  fetchedUsers: string[]; // strings containing numbers - profile IDs
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
    this.stream = this.client.stream('statuses/filter', { follow: this.fetchedUsers.join(',') });
    this.stream.on('tweet', (tweet: TwitterPost) => {
      console.log(JSON.stringify(tweet));
      // some of tweets showed here are just mentioning the followed person
      // and we shouldn't archive them because:
      // A. they're not made by public persons
      // B. it's just spammy and not interesing
      if (this.fetchedUsers.includes(tweet.user.id_str)) {
        const post = {
          author: {
            readable_name: tweet.user.name,
            username: tweet.user.screen_name,
            service: this.serviceName,
            external_id: tweet.user.id_str,
            avatar: tweet.user.profile_image_url_https,
          },
          content: tweet.text,
          embeds: tweet.entities.media ? tweet.entities.media.map(e => ({
            type: PolitEmbedType.IMAGE,
            url: e.media_url_https,
          })) : [],
          id: tweet.id_str,
          createTimestamp: parseInt(tweet.timestamp_ms, 10),
        } as PolitPost;
        this.context.listenerApi.savePost(post);
      }
    });
    this.stream.on('delete', (deleteInfo: TwitterDeleteInfo) => {
      console.log(deleteInfo);
      this.context.listenerApi.savePostDeleteInfo(
        deleteInfo.delete.status.id_str, parseInt(deleteInfo.delete.timestamp_ms, 10));
    });
  }

  async stop() {
    if (this.stream) {
      this.stream.stop();
    }
  }

}
