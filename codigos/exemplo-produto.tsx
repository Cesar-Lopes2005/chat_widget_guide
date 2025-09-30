// Exemplo: Integrar com página de produtos
import React from 'react';

interface ProductCardProps {
  productName: string;
  productPrice: string;
  productImage: string;
  onChatOpen: (message: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  productPrice,
  productImage,
  onChatOpen
}) => {
  const handleAskAboutProduct = () => {
    onChatOpen(`Gostaria de saber mais sobre ${productName}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <img
        src={productImage}
        alt={productName}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{productName}</h3>
      <p className="text-xl font-bold text-blue-600 mb-4">{productPrice}</p>

      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Comprar
        </button>
        <button
          onClick={handleAskAboutProduct}
          className="flex-1 border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50"
        >
          Perguntar
        </button>
      </div>
    </div>
  );
};

// Uso na página
const ProductsPage = () => {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [initialMessage, setInitialMessage] = React.useState<string>();

  const handleChatOpen = (message: string) => {
    setInitialMessage(message);
    setIsChatOpen(true);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Nossos Produtos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProductCard
          productName="Produto A"
          productPrice="R$ 99,90"
          productImage="/images/produto-a.jpg"
          onChatOpen={handleChatOpen}
        />
        <ProductCard
          productName="Produto B"
          productPrice="R$ 149,90"
          productImage="/images/produto-b.jpg"
          onChatOpen={handleChatOpen}
        />
        <ProductCard
          productName="Produto C"
          productPrice="R$ 199,90"
          productImage="/images/produto-c.jpg"
          onChatOpen={handleChatOpen}
        />
      </div>

      {/* Widget de Chat */}
      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        initialMessage={initialMessage}
      />
    </div>
  );
};

export default ProductsPage;