import { Hero } from '@/components/home/hero'
import { PopularTools } from '@/components/home/popular-tools'
import { FeaturedTools } from '@/components/home/featured-tools'
import { CategoriesSection } from '@/components/home/categories-section'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { FAQ } from '@/components/home/faq'

export default function Home() {
  return (
    <>
      <Hero />
      <PopularTools />
      <FeaturedTools />
      <CategoriesSection />
      <WhyChooseUs />
      <FAQ />
    </>
  )
}