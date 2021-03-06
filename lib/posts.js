import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

//Get 'posts' directory
const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData(){

  // Get file names under /posts
  const fileName = fs.readdirSync(postsDirectory)
  const allPostsData=fileName.map(fileName => {
    // Remove .md from file name
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory,fileName)
    const fileContents = fs.readFileSync(fullPath,'utf8')

    const matterResult = matter(fileContents)
    return {
      id,
      ...matterResult.data
    }
  })

  return allPostsData.sort(({date: a}, {date: b}) =>{
    if(a<b) {
      return 1
    } else if (a>b){
      return -1
    } else {
      return 0
    }
  })
}

export function getAllPostsIds(){
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames.map (fileName =>{
    return {
      params:{
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}
// each object must have the params key and containe an object
//with the id key ([id] in name), otherwise getStaticPaths will fail

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath,'utf8')

  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

  return{
    id,
    contentHtml,
    ...matterResult.data
  }
}