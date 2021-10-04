import fs from "fs/promises";
import { constants } from "fs";

const PATH = './db.json'

/**
 * 所有的图片信息都存在这个全局变量里
 * （实际上就是个数组
 */
export var imgs = []

/**
 * 首次初始化 `db.json` 文件
 */
export async function init() {
  try {
    await fs.access(PATH, constants.F_OK)
    const data = await fs.readFile(PATH)
    imgs = JSON.parse(data)
  } catch {
    await fs.writeFile(PATH, JSON.stringify(imgs))
  }
}

export async function save() {
  await fs.writeFile(PATH, JSON.stringify(imgs))
}

/**
 * 添加一张图片
 * path 和 caption 分别为
 * 图片的完整路径和标注信息，`path` 为字符串，`caption` 为数组
 */
export async function add(path, caption) {
  imgs.push({path, caption})
  await save()
}

/**
 * 根据图片路径查找图片记录
 * `path` 为图片完整路径
 * 返回的是一个数组,数组为空则说明没找到
 */
export function find(path) {
  return imgs.filter(img => img.path === path)
}

/**
 * 根据图片完整路径删除一条图片记录
 */
export async function remove(path) {
  imgs = imgs.filter(img => !(img.path === path))
  await save()
}
