import jsonp from 'common/js/jsonp'
import { commonParams, options } from 'api/config'
import axios from 'axios'
// 轮播图
export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}
// 全部歌单
export function getDiscList () {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    rnd: Math.random(),
    g_tk: 79245072,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: 'json'
  })
  return axios(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
// 热门歌单
export function getSongList (dissid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

  const data = Object.assign({}, commonParams, {
    disstid: dissid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    g_tk: 79245072,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return jsonp(url, data, options)
}
