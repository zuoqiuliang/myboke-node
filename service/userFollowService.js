const userFollowDao = require("../dao/userFollowDao");
const userDao = require("../dao/userDao");

// 关注关系Service类
class UserFollowService {
	/**
	 * 关注用户
	 * @param {string} followerId - 关注者ID
	 * @param {string} followingId - 被关注者ID
	 * @returns {Promise<Object>} 关注结果
	 */
	async followUser(followerId, followingId) {
		try {
			// 检查是否关注自己
			if (followerId === followingId) {
				throw new Error("不能关注自己");
			}

			// 检查被关注用户是否存在
			const followingUser = await userDao.checkUserExistDao(followingId);
			if (!followingUser) {
				throw new Error("被关注的用户不存在");
			}

			// 创建关注关系
			const follow = await userFollowDao.createFollow({
				followerId,
				followingId
			});

			return {
				success: true,
				message: "关注成功",
				data: follow
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || "关注失败"
			};
		}
	}

	/**
	 * 取消关注
	 * @param {string} followerId - 关注者ID
	 * @param {string} followingId - 被关注者ID
	 * @returns {Promise<Object>} 取消关注结果
	 */
	async unfollowUser(followerId, followingId) {
		try {
			// 检查是否关注自己
			if (followerId === followingId) {
				throw new Error("不能取消关注自己");
			}

			// 删除关注关系
			const success = await userFollowDao.deleteFollow(followerId, followingId);

			if (!success) {
				throw new Error("未关注该用户");
			}

			return {
				success: true,
				message: "取消关注成功"
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || "取消关注失败"
			};
		}
	}

	/**
	 * 获取用户的关注列表
	 * @param {string} userId - 用户ID
	 * @param {Object} options - 查询选项
	 * @param {number} options.page - 页码
	 * @param {number} options.pageSize - 每页数量
	 * @returns {Promise<Object>} 关注列表结果
	 */
	async getFollowingList(userId, options = {}) {
		try {
			const { page = 1, pageSize = 20 } = options;
			const offset = (page - 1) * pageSize;

			// 获取关注列表
			const follows = await userFollowDao.getFollowingList(userId, {
				offset,
				limit: pageSize
			});

			// 格式化结果
			const followingList = follows.map((item) => ({
				id: item.following.id,
				phone: item.following.phone,
				followedAt: item.createdAt
			}));

			// 获取关注总数
			const total = await userFollowDao.getFollowingCount(userId);

			return {
				success: true,
				data: {
					list: followingList,
					total,
					page,
					pageSize
				}
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || "获取关注列表失败"
			};
		}
	}

	/**
	 * 获取用户的粉丝列表
	 * @param {string} userId - 用户ID
	 * @param {Object} options - 查询选项
	 * @param {number} options.page - 页码
	 * @param {number} options.pageSize - 每页数量
	 * @returns {Promise<Object>} 粉丝列表结果
	 */
	async getFollowersList(userId, options = {}) {
		try {
			const { page = 1, pageSize = 20 } = options;
			const offset = (page - 1) * pageSize;

			// 获取粉丝列表
			const follows = await userFollowDao.getFollowersList(userId, {
				offset,
				limit: pageSize
			});

			// 格式化结果
			const followersList = follows.map((item) => ({
				id: item.follower.id,
				phone: item.follower.phone,
				followedAt: item.createdAt
			}));

			// 获取粉丝总数
			const total = await userFollowDao.getFollowersCount(userId);

			return {
				success: true,
				data: {
					list: followersList,
					total,
					page,
					pageSize
				}
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || "获取粉丝列表失败"
			};
		}
	}

	/**
	 * 检查关注状态
	 * @param {string} followerId - 关注者ID
	 * @param {string} followingId - 被关注者ID
	 * @returns {Promise<Object>} 关注状态
	 */
	async checkFollowStatus(followerId, followingId) {
		try {
			// 检查是否是自己
			if (followerId === followingId) {
				return {
					success: true,
					data: {
						is_following: false,
						is_self: true
					}
				};
			}

			// 检查关注状态
			const isFollowing = await userFollowDao.isFollowing(followerId, followingId);

			return {
				success: true,
				data: {
					is_following,
					is_self: false
				}
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || "检查关注状态失败"
			};
		}
	}

	/**
	 * 获取用户的关注和粉丝数量
	 * @param {string} userId - 用户ID
	 * @returns {Promise<Object>} 数量信息
	 */
	async getFollowCounts(userId) {
		try {
			// 获取关注数
			const followingCount = await userFollowDao.getFollowingCount(userId);

			// 获取粉丝数
			const followersCount = await userFollowDao.getFollowersCount(userId);

			return {
				success: true,
				data: {
					followingCount,
					followersCount
				}
			};
		} catch (error) {
			return {
				success: false,
				message: error.message || "获取关注数量失败"
			};
		}
	}
}

module.exports = new UserFollowService();
