import log from 'consola';
import Twit, { Stream } from 'twit';
import { TwitterPost, TwitterDeleteInfo } from './TwitterModels';
import {
  PolitPostListenerBase,
  PolitPostListenerState,
  PolitPostListenerConstructor,
} from '../../PolitPostListenerBase';
import { Account } from '../../../entities/Account';
import { RxEvent } from '../../../utils/rxjsEvent';
import TwitterRemapper from './TwitterRemapper';

const MAX_ACCOUNTS_PER_STREAM = 5000;

export default class TwitterListener extends PolitPostListenerBase {
  client: Twit;
  fetchedAccounts: Account[];
  remapper: TwitterRemapper;
  streams?: Stream[];
  serviceName: string = 'twitter';

  constructor(data: PolitPostListenerConstructor) {
    super(data);
    this.remapper = new TwitterRemapper();
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
  }

  async start() {
    log.debug(this.fetchedAccounts);
    if (this.fetchedAccounts.length) {
      this.state = PolitPostListenerState.STARTING;
      const accs: Account[][] = this.fetchedAccounts.reduce((pre, cur, i) => {
        const ci = Math.floor(i / MAX_ACCOUNTS_PER_STREAM);
        if (!pre[ci]) {
          pre[ci] = [];
        }
        pre[ci].push(cur);
        return pre;
      },                                                    [] as Account[][]);
      this.streams = accs.map(streamAccs => this.client.stream(
        'statuses/filter', { follow: streamAccs.map(a => a.externalId).join(',') }));
      this.streams.forEach((stream) => {
        stream.on('tweet', (tweet: TwitterPost) => {
          log.debug(JSON.stringify(tweet));
          /*
            some of tweets showed here are just mentioning the followed person
            and we shouldn't archive them because:
            A. they're not made by public persons
            B. it's just spammy and not interesing
          */
          const posterAccount = this.fetchedAccounts.find(u => u.externalId === tweet.user.id_str);
          if (posterAccount) {
            this.listener(
              new RxEvent(
                'newPost',
                this.remapper.rawPostToEntity(tweet, posterAccount)),
            );
          }
        });
        stream.on('delete', (deleteInfo: TwitterDeleteInfo) => {
          log.debug(deleteInfo);
          this.listener(
            new RxEvent('deletedPost', this.remapper.deleteInfoToPost(deleteInfo)));
        });
      });
      this.state = PolitPostListenerState.RUNNING;
    } else {
      this.state = PolitPostListenerState.BROKEN;
    }
  }

  async stop() {
    if (this.streams) {
      this.streams.forEach(stream => stream.stop());
    }
    this.state = PolitPostListenerState.STOPPED;
  }

}
