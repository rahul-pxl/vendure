import { ID, Type } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { VendureEntity } from '../../../entity/base/base.entity';

import { WhereCondition } from './parse-filter-params';

/**
 * Creates a WhereCondition for a channel-aware entity, filtering for only those entities
 * which are assigned to the channel speicified by channelId,
 */
export function parseChannelParam<T extends VendureEntity>(
    connection: Connection,
    entity: Type<T>,
    channelId: ID,
): WhereCondition | undefined {
    const metadata = connection.getMetadata(entity);
    const alias = metadata.name.toLowerCase();
    const relations = metadata.relations;
    const channelRelation = relations.find(r => r.propertyName === 'channels');
    if (!channelRelation) {
        return;
    }
    return {
        clause: `${alias}_channels.id = :channelId`,
        parameters: { channelId },
    };
}