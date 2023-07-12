import request from '@/utils/request'

// 分页获取文章
// page 代表当前第几页， limit代表每一页的数量
export function getBlogList( page = 1, limit = 10 ) {
  return request({
    url: '/api/blog',
    method: 'get',
    params: {
      page,
      limit,
    }
  })
}

// 设置首页标语
export function setBanner(data) {
  return request({
    url: '/api/banner',
    method: 'post',
    data
  })
}

// 删除文章
export function delOneBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: 'delete',
  })
}

// 发布文章
export function addBlog(data) {
  return request({
    url: '/api/blog',
    method: 'post',
    data
  })
}

// 编辑文章
// 倒时候调用这个接口时，需要传递一个对象
// {
//     id : 要修改的文章的 id,
//     data : 修改的文章的所有内容
// }
export function editBlog(blogInfo) {
  return request({
    url: `/api/blog/${blogInfo.id}`,
    method: 'put',
    data: blogInfo.data
  })
}

// 根据id获取单篇文章
export function findOneBlog(id){
  return request({
      url : `/api/blog/${id}`,
      method : 'get'
  })
}