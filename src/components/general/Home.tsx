import { PRODUCTS } from '../../helpers/products';
import ProductBox from './ProductBox';

const Home = (): JSX.Element => {
  return (
    <div className={'container mx-auto pt-16 p-4 grid grid-cols-4 gap-4'}>
      {Object.values(PRODUCTS).map((product, index: number) => {
        if (product.active) {
          return <ProductBox key={index} product={product} />;
        }
        return null;
      })}
    </div>
  );
};

export default Home;
