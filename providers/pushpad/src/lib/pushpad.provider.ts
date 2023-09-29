import {
  ChannelTypeEnum,
  ISendMessageSuccessResponse,
  IPushOptions,
  IPushProvider,
} from '@novu/stateless';
import * as Pushpad from 'pushpad';

export class PushpadPushProvider implements IPushProvider {
  id = 'pushpad';
  channelType = ChannelTypeEnum.PUSH as ChannelTypeEnum.PUSH;

  private pushpad: Pushpad.Pushpad;

  constructor(
    private config: {
      apiKey: string;
      appId: string;
    }
  ) {
    this.pushpad = new Pushpad.Pushpad({
      authToken: this.config.apiKey,
      projectId: this.config.appId,
    });
  }

  async sendMessage(
    options: IPushOptions
  ): Promise<ISendMessageSuccessResponse> {
    const notification = new Pushpad.Notification({
      project: this.pushpad,
      body: options.content,
      title: options.title,
    });

    let notificationId = null;

    if (options.target) {
      notification.deliverTo(options.target, function (err, result) {
        if (err) {
          throw Error(err);
        }
        notificationId = result.id;
      });
    } else {
      notification.broadcast(function (err, result) {
        if (err) {
          throw Error(err);
        }
        notificationId = result.id;
      });
    }

    return {
      id: notificationId,
      date: new Date().toISOString(),
    };
  }
}
