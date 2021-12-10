import { Link } from 'react-router-dom';
import { IProduct } from '../../helpers/products';

const ProductBox = ({ product }: { product: IProduct }): JSX.Element => {
  return (
    <div
      className={'text-white rounded-xl text-center bg-indigo-900 bg-opacity-60 hover:bg-opacity-75 h-96 relative p-8'}
    >
      <h2 className={'text-3xl font-bold'}>{product.name}</h2>
      <img className={'h-24 m-8 mx-auto'} alt={'logo'} src={product.logo} />
      <p className={'w-1/2 mx-auto text-lg'}>{product.description}</p>
      <Link
        className="absolute px-16 py-2 text-xl bg-pink-500 rounded-md hover:bg-pink-600 inset-x-24 bottom-4"
        to={product.link}
      >
        Enter
      </Link>
    </div>
  );
};

export default ProductBox;
