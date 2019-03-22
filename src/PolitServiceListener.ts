import { Subject } from 'rxjs';
import { RxEvent } from './utils/rxjsEvent';
import { Post } from './entities/Post';
import { Embed } from './entities/Embed';
import { getConnectionManager, Connection, Repository } from 'typeorm';

type EventData = any;

class PolitListenerApi {
  connection: Connection;
  postRepo: Repository<Post>;
  embedRepo: Repository<Embed>;
  subject: Subject<RxEvent<EventData>>;
  events: {
    [key: string]: (d: EventData) => void;
  };

  constructor() {
    this.connection = getConnectionManager().get();
    this.postRepo = this.connection.getRepository(Post);
    this.embedRepo = this.connection.getRepository(Embed);
    this.events = {
      newPost: this.savePost,
      deletedPost: this.updatePost,
    };
    this.subject = new Subject<RxEvent<EventData>>();
    this.subject.subscribe((event) => {
      const eventHandler = this.events[event.eventType];
      if (eventHandler) {
        eventHandler.bind(this)(event.data);
      }
    });
  }

  public getListener() {
    return (ev: RxEvent<any>) => this.subject.next(ev);
  }

  async saveEmbed(embed: Embed) {
    this.embedRepo.save(embed);
  }

  async savePost(post: Post) {
    const savedPost = await this.postRepo.save(post);
    if (post.embeds.length) {
      post.embeds.map((e: Embed) => {
        e.origin = savedPost;
        return e;
      }).forEach(e => this.saveEmbed(e));
    }
  }

  async updatePost({ service, externalId, deleteTimestamp }) {
    const post = await this.postRepo.findOne({ service, externalId });
    if (post) {
      post.deleted = true;
      post.deleteTimestamp = deleteTimestamp;

      this.postRepo.save(post);
    }
  }

}

export default PolitListenerApi;
