import { Bank } from 'oldschooljs';

import { randomizeBank } from '../../lib/randomizer';
import Runecraft from '../../lib/skilling/skills/runecraft';
import { SkillsEnum } from '../../lib/skilling/types';
import { TiaraRunecraftActivityTaskOptions } from '../../lib/types/minions';
import { handleTripFinish } from '../../lib/util/handleTripFinish';

export const tiaraRunecraftTask: MinionTask = {
	type: 'TiaraRunecraft',
	async run(data: TiaraRunecraftActivityTaskOptions) {
		const { tiaraID, tiaraQuantity, userID, channelID, duration } = data;
		const user = await mUserFetch(userID);

		const tiara = Runecraft.Tiaras.find(_tiara => _tiara.id === tiaraID)!;

		const xpReceived = tiaraQuantity * tiara.xp;
		let xpRes = `\n${await user.addXP({
			skillName: SkillsEnum.Runecraft,
			amount: xpReceived,
			duration
		})}`;
		let str = `${user}, ${user.minionName} finished crafting ${tiaraQuantity} ${tiara.name}. ${xpRes}`;

		let loot = new Bank({
			[tiara.id]: tiaraQuantity
		});
		loot = randomizeBank(user.id, loot);
		str += `\n\nYou received: ${loot}.`;

		await transactItems({
			userID: user.id,
			collectionLog: true,
			itemsToAdd: loot
		});

		handleTripFinish(user, channelID, str, undefined, data, loot);
	}
};
