import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

import { schemaOptions } from '../schema-default.options';
import { ChangeDBModel } from './change.entity';

const changeSchema = new Schema<ChangeDBModel>(
  {
    enabled: {
      type: Schema.Types.Boolean,
      default: false,
    },
    type: {
      type: Schema.Types.String,
    },
    change: Schema.Types.Mixed,
    _environmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Environment',
    },
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    _entityId: Schema.Types.ObjectId,
    _creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    _parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Change',
    },
  },
  { ...schemaOptions }
);

changeSchema.virtual('user', {
  ref: 'User',
  localField: '_creatorId',
  foreignField: '_id',
  justOne: true,
});

changeSchema.index({
  _environmentId: 1,
  _parentId: 1,
  _entityId: 1,
  createdAt: 1,
  type: 1,
  enabled: 1,
  _creatorId: 1,
});

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Change =
  (mongoose.models.Change as mongoose.Model<ChangeDBModel>) || mongoose.model<ChangeDBModel>('Change', changeSchema);
