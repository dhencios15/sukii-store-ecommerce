import CategoryProduct from '@components/CategoryProduct'
import { Container } from '@components/common'
import ProductCard from '@components/ProductCard'
import type { Product } from '@lib/types'
import { GetStaticPaths, GetStaticProps } from 'next'
import React from 'react'

interface IProps {
  product: Product
  productsInCategory: Product[]
  category: string
}

export default function SingleProduct({ product, productsInCategory }: IProps) {
  const filterProd = productsInCategory.filter((d) => d.id !== product.id)

  return (
    <Container>
      <ProductCard product={product} />
      <CategoryProduct category="YOU MIGHT ALSO LIKE">
        {filterProd.map((product: Product) => (
          <ProductCard key={product.title} product={product} />
        ))}
      </CategoryProduct>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { params } = context
  const resProducts = await fetch(
    `https://fakestoreapi.com/products/${params?.product}`
  )
  const resCategories = await fetch(
    `https://fakestoreapi.com/products/category/${params?.category}`
  )
  const product = await resProducts.json()
  const productsInCategory = await resCategories.json()

  return {
    props: { product, productsInCategory },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch('https://fakestoreapi.com/products')
  const products = await response.json()

  const paths = products.map((product: Product) => ({
    params: { category: product.category, product: `${product.id}` },
  }))

  return {
    paths,
    fallback: false,
  }
}
