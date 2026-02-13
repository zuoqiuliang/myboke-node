const UserFollow = require("./model/userFollowModel");
const User = require("./model/userCModel");

// 关注关系DAO类
class UserFollowDao {
	/**
	 * 创建关注关系
	 * @param {Object} followData - 关注关系数据
	 * @param {string} followData.followerId - 关注者ID
	 * @param {string} followData.followingId - 被关注者ID
	 * @returns {Promise<Object>} 关注关系对象
	 */
	async createFollow(followData) {
		try {
			// 检查是否已经关注
			const existingFollow = await this.getFollow(followData.followerId, followData.followingId);
			if (existingFollow) {
				throw new Error("已经关注了该用户");
			}

			// 创建关注关系
			const follow = await UserFollow.create(followData);
			return follow;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 删除关注关系（取消关注）
	 * @param {string} followerId - 关注者ID
	 * @param {string} followingId - 被关注者ID
	 * @returns {Promise<boolean>} 是否成功取消关注
	 */
	async deleteFollow(followerId, followingId) {
		try {
			const result = await UserFollow.destroy({
				where: {
					followerId,
					followingId
				}
			});
			return result > 0;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 获取关注关系
	 * @param {string} followerId - 关注者ID
	 * @param {string} followingId - 被关注者ID
	 * @returns {Promise<Object|null>} 关注关系对象或null
	 */
	async getFollow(followerId, followingId) {
		try {
			const follow = await UserFollow.findOne({
				where: {
					followerId,
					followingId
				}
			});
			return follow;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 获取用户的关注列表
	 * @param {string} userId - 用户ID（关注者ID）
	 * @param {Object} options - 查询选项
	 * @param {number} options.offset - 偏移量
	 * @param {number} options.limit - 限制数量
	 * @returns {Promise<Array>} 关注列表
	 */
	async getFollowingList(userId, options = {}) {
		try {
			const { offset = 0, limit = 20 } = options;

			const follows = await UserFollow.findAll({
				where: {
					followerId: userId
				},
				include: [{
					model: User,
					as: "following",
					attributes: ["id", "phone"]
				}],
				limit,
				offset,
				order: [["createdAt", "DESC"]]
			});

			return follows;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 获取用户的粉丝列表
	 * @param {string} userId - 用户ID（被关注者ID）
	 * @param {Object} options - 查询选项
	 * @param {number} options.offset - 偏移量
	 * @param {number} options.limit - 限制数量
	 * @returns {Promise<Array>} 粉丝列表
	 */
	async getFollowersList(userId, options = {}) {
		try {
			const { offset = 0, limit = 20 } = options;

			const follows = await UserFollow.findAll({
				where: {
					followingId: userId
				},
				include: [{
					model: User,
					as: "follower",
					attributes: ["id", "phone"]
				}],
				limit,
				offset,
				order: [["createdAt", "DESC"]]
			});

			return follows;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 获取用户的关注数
	 * @param {string} userId - 用户ID
	 * @returns {Promise<number>} 关注数
	 */
	async getFollowingCount(userId) {
		try {
			const count = await UserFollow.count({
				where: {
					followerId: userId
				}
			});
			return count;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 获取用户的粉丝数
	 * @param {string} userId - 用户ID
	 * @returns {Promise<number>} 粉丝数
	 */
	async getFollowersCount(userId) {
		try {
			const count = await UserFollow.count({
				where: {
					followingId: userId
				}
			});
			return count;
		} catch (error) {
			throw error;
		}
	}

	/**
	 * 检查用户是否关注了另一个用户
	 * @param {string} followerId - 关注者ID
	 * @param {string} followingId - 被关注者ID
	 * @returns {Promise<boolean>} 是否已关注
	 */
	async isFollowing(followerId, followingId) {
		try {
			const follow = await this.getFollow(followerId, followingId);
			return !!follow;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = new UserFollowDao();