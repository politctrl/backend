import { TwitterPost, TwitterDeleteInfo } from './TwitterModels';
import { Post } from '../../../entities/Post';
import { Account } from '../../../entities/Account';
import { Embed } from '../../../entities/Embed';
import { PolitEmbedType } from '../../../models';
import { stripHTML } from '../../../utils/stripHTML';

class TwitterRemapper {
  serviceName = 'twitter';

  rawPostToEntity(tweet: TwitterPost, posterAccount: Account) {
    const post = new Post();
    post.author = posterAccount;
    post.createTimestamp = parseInt(tweet.timestamp_ms, 10);
    post.deleted = false;
    post.externalId = tweet.id_str;
    post.service = this.serviceName;
    post.replyToId = tweet.in_reply_to_status_id_str;
    post.app = stripHTML(tweet.source);
    post.originalUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

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
        embed.origin = post;
        post.embeds.push(embed);
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

    return post;
  }

  deleteInfoToPost(deleteInfo: TwitterDeleteInfo) {
    return {
      service: 'twitter',
      externalId: deleteInfo.delete.status.id_str,
      deleteTimestamp: deleteInfo.delete.timestamp_ms,
    };
  }
}

export default TwitterRemapper;
