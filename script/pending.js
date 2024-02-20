module.exports.config = {
	name: "pending",
	version: "1.0.5",
	credits: "Mirai Team",
	role: 2,
	hasPrefix: true,
	description: "Manage bot's waiting messages",
	aliases: ["pend"],
	cooldowns: 5
};

const languages = {
	"vi": {
		"invaildNumber": "%1 không phải là một con số hợp lệ",
		"cancelSuccess": "Đã từ chối thành công %1 nhóm!",
		"notiBox": "Box của bạn đã được admin phê duyệt để có thể sử dụng bot",
		"approveSuccess": "Đã phê duyệt thành công %1 nhóm!",

		"cantGetPendingList": "Không thể lấy danh sách các nhóm đang chờ!",
		"returnListPending": "「PENDING」❮ Tổng số nhóm cần duyệt: %1 nhóm ❯\n\n%2",
		"returnListClean": "「PENDING」Hiện tại không có nhóm nào trong hàng chờ"
	},
	"en": {
		"invaildNumber": "%1 is not an invalid number",
		"cancelSuccess": "Refused %1 thread!",
		"notiBox": "🌐 BoT Connected Successfully✅!\nUse /help for more info :>",
		"approveSuccess": "Approved successfully %1 threads!",

		"cantGetPendingList": "Can't get the pending list!",
		"returnListPending": "»「PENDING」«❮ The whole number of threads to approve is: %1 thread ❯\n\n%2",
		"returnListClean": "「PENDING」There is no thread in the pending list"
	}
};

const handleReply = async function({ api, event }) {
	const { body, threadID, messageID, senderID } = event;
	let count = 0;

	if (isNaN(body) && (body.indexOf("c") === 0 || body.indexOf("cancel") === 0)) {
		const index = (body.slice(1, body.length)).split(/\s+/);
		for (const singleIndex of index) {
			console.log(singleIndex);
			if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > this.pending.length) {
				return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
			}
			await api.removeUserFromGroup(api.getCurrentUserID(), this.pending[singleIndex - 1].threadID);
			count++;
		}
		return api.sendMessage(getText("cancelSuccess", count), threadID, messageID);
	} else {
		const index = body.split(/\s+/);
		for (const singleIndex of index) {
			if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > this.pending.length) {
				return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);
			}
			await api.sendMessage(getText("notiBox"), this.pending[singleIndex - 1].threadID);
			count++;
		}
		return api.sendMessage(getText("approveSuccess", count), threadID, messageID);
	}
};

module.exports.run = async function({ api }) {
	const { threadID, messageID, senderID } = event;
	const commandName = this.config.name;
	let msg = "";
	let index = 1;

	try {
		const spam = await api.getThreadList(100, null, ["OTHER"]) || [];
		const pending = await api.getThreadList(100, null, ["PENDING"]) || [];
		const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

		for (const single of list) {
			msg += `${index++}/ ${single.name}(${single.threadID})\n`;
		}

		if (list.length !== 0) {
			return api.sendMessage(getText("returnListPending", list.length, msg), threadID, (error, info) => {
				handleReply.push({
					name: commandName,
					messageID: info.messageID,
					author: senderID,
					pending: list
				});
			}, messageID);
		} else {
			return api.sendMessage(getText("returnListClean"), threadID, messageID);
		}
	} catch (error) {
		console.error(error);
		return api.sendMessage(getText("cantGetPendingList"), threadID, messageID);
	}
};

// Helper function to get text based on language
function getText(key, ...params) {
	const lang = "en"; // Assuming default language is English
	if (languages[lang] && languages[lang][key]) {
		return languages[lang][key].replace(/%(\d+)/g, (match, number) => {
			return params[number - 1] || match;
		});
	} else {
		return key;
	}
}
