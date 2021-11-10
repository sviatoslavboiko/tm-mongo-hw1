'use strict'

const {mapUser, getRandomFirstName, mapArticle} = require('./util')

const students = require('./students.json')

// db connection and settings
const connection = require('./config/connection')
let userCollection, articlesCollection, studentsCollection
run()

async function run() {
  await connection.connect()
  await connection.get().dropCollection('users')
  await connection.get().createCollection('users')
  userCollection = connection.get().collection('users')

  await connection.get().dropCollection('articles')
  await connection.get().createCollection('articles')
  articlesCollection = connection.get().collection('articles')

  await connection.get().dropCollection('students')
  await connection.get().createCollection('students')
  studentsCollection = connection.get().collection('students')

  await example1()
  await example2()
  await example3()
  await example4()
  await example5()
  await example6()
  await example7()
  await example8()
  await example9()
  await example10()


  await connection.close()
}

// #### Users

// - Create 2 users per department (a, b, c)
async function example1() {
  
  const departments = ['a','a','b','b','c','c'];
  const users = departments.map((department) => mapUser({department}))
  try {

    const {result} = await userCollection.insertMany(users)
    console.log(`Added ${result.n} users`);
  } catch (err) {
    console.error(err)
  }
}

// - Delete 1 user from department (a)

async function example2() {
  try {
    
    const {result} = await userCollection.deleteOne({department: 'a'})
    console.log(`Removed ${result.n} user`)
  } catch (err) {
    console.error(err)
  }
}

// - Update firstName for users from department (b)

async function example3() {
  try {

    const {result} = await userCollection.updateMany({department: 'b'}, {$set: {firstName: getRandomFirstName()}})
    console.log(`Updated ${result.n} users`);

  } catch (err) {
    console.error(err)
  }
}

// - Find all users from department (c)
async function example4() {
  try {

    const users = [...(await userCollection.find({department: 'c'}, {firstName: 1}).toArray())].map(mapUser)
    console.log('Users:')
    for (let user of users) {
      console.log(user);
    }


  } catch (err) {
    console.error(err)
  }
}

// #### Articles

// - Create 5 articles per each type (a, b, c)
async function example5() {
  
  const types = ['a','a','a','a','a','b','b','b','b','b','c','c','c','c','c'];
  const articles = types.map((type) => mapArticle({type}))
  try {

    const {result} = await articlesCollection.insertMany(articles)
    console.log(`Added ${result.n} articles`);
  } catch (err) {
    console.error(err)
  }
}

// - Find articles with type a, and update tag list with next value [‘tag1-a’, ‘tag2-a’, ‘tag3’]
async function example6() {
  try {
    
    const {result} = await articlesCollection.updateMany({ type : 'a' }, { $set: { "tags" :  ['tag1-a', 'tag2-a', 'tag3'] } })
    console.log(`Updated ${result.n} articles`);
  } catch (err) {
    console.error(err)
  }
}

// - Add tags [‘tag2’, ‘tag3’, ‘super’] to other articles except articles from type a
async function example7() {
  try {
    
    const {result} = await articlesCollection.updateMany({ type : {$not: /a/ }}, { $set: { "tags" :  ['tag2', 'tag3', 'super'] } })
    console.log(`Updated ${result.n} articles`);
  } catch (err) {
    console.error(err)
  }
}
// - Find all articles that contains tags [tag2, tag1-a]
async function example8() {
  try {

    const articles = [...(await articlesCollection.find({tags: {$in: ['tag2', 'tag1-a']}}, {name: 1}).toArray())].map(mapArticle)
    // const articles = [...(await articlesCollection.find({tags: {$all: ['tag2', 'tag1-a']}}, {name: 1}).toArray())].map(mapArticle)
    console.log('Articles:')
    for (let article of articles) {
      console.log(article);
    }
  } catch (err) {
    console.error(err)
  }
}

// - Pull [tag2, tag1-a] from all articles
async function example9() {
  try {

    const {result} = await articlesCollection.updateMany( { }, { $pull: { tags: { $in: [ 'tag2', 'tag1-a' ] }}})
    console.log(`Updated ${result.n} articles`);
  } catch (err) {
    console.error(err)
  }
}

// #### Students

// - Create users from students.json
async function example10() {
  try {

    const {result} = await studentsCollection.insertMany(students)
    console.log(`Added ${result.n} students`);
  } catch (err) {
    console.error(err)
  }
}