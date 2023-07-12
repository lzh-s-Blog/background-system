import request from '@/utils/request'

// 获取所有项目
export function getProject() {
  return request({
    url: '/api/project',
    method: 'get',
  })
}

// 修改项目
export function modifyProject(id, data) {
  return request({ 
    url: `/api/project/${id}`,
    method: 'put',
    data
  })
}

// 添加项目
export function addProject(data) {
  return request({
    url: '/api/project',
    method: 'post',
    data
  })
}

// 删除项目
export function delProject(id) {
  return request({
    url: `/api/project/${id}`,
    method: 'delete',
  })
}
