const express = require('express');
const router = express.Router();
const axios = require('axios');
const { formatResponse } = require('../utils/tool');

// 图片代理路由
router.get('/image', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.send(formatResponse(400, '缺少图片链接', null));
    }

    // 发送请求获取图片，设置合适的请求头
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://user.qzone.qq.com/' // 模拟 QQ 空间访问
      }
    });

    // 设置响应头并转发图片流
    res.set('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('图片代理错误:', error);
    res.send(formatResponse(500, '图片获取失败', null));
  }
});

module.exports = router;