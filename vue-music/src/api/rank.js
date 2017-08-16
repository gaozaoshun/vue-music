import jsonp from 'common/js/jsonp'
import { commonParams, options } from 'api/config'
// 排行榜
export function getTopList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// 音乐列表
export function getSongList (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid,
    _: 1501164640706
  })
  return jsonp(url, data, options)
}
