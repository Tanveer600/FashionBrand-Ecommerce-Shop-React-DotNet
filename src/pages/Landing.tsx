import { Banner, CategoriesSection, HomeCollectionSection, ProductGrid } from "../components";

const Landing = () => {
  return (
    <>
      <Banner />
      <HomeCollectionSection />
      <CategoriesSection /> {/* Yahan ise render karein */}
      <ProductGrid />
      
    </>
  );
};
export default Landing;
