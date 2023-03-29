import {getCliClient} from 'sanity/cli'
import {uuid} from '@sanity/uuid'
import {faker} from '@faker-js/faker'

const PRODUCT = () => ({
  _id: uuid(),
  _type: 'product',
  title: faker.commerce.productName(),
  content: faker.commerce.productDescription(),
  price: Number(faker.commerce.price(100, 500, 0)),
  // image: faker.image.imageUrl(800, 600, undefined, true)
})

async function seedContent() {
  const client = getCliClient()

  // Delete existing!!
  await client.delete({query: `*[_type == "product"]`}).then(() => console.log(`deleted existing products`))

  const transaction = client.transaction()
  const products = Array.from({length: 100}, PRODUCT)
  products.forEach(product => transaction.createOrReplace(product))
  transaction.commit().then(() => console.log(`done!`))
}

seedContent()
