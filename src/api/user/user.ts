import {get, post} from '@/api/index';
const userApi = {
    UserList: '/systemConfiguration/getUserList',
    Login: '/login',
    deleteUser: '/systemConfiguration/deleteUser',
    Register: '/register',
    resetPwd: '/resetPwd',
    updatePwd:'/updatePwd',
}

export default userApi

export function getUserList (parameter) {
    return get(userApi.UserList, parameter, {'charset': 'utf-8'});
}


export function Login (parameter) {
    return post(userApi.Login, parameter, {'charset': 'utf-8','Content-Type': 'application/json'});
}
export function deleteUser (parameter) {
    return get(userApi.deleteUser, parameter, {'charset': 'utf-8'});
}
export function Register (parameter) {
    return post(userApi.Register, parameter, {'charset': 'utf-8','Content-Type': 'application/json'});
}
export function resetPwd (parameter) {
  return post(userApi.resetPwd, parameter, {'charset': 'utf-8','Content-Type': 'application/json'});
}

export function updatePwd (parameter) {
  return post(userApi.updatePwd, parameter, {'charset': 'utf-8','Content-Type': 'application/json'});
}


