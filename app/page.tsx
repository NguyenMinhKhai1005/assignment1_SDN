"use client";

import { useSession } from "next-auth/react"; 
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSearch } from "@/context/SearchContext";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const { search, setSearch } = useSearch();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/products?search=${search}&page=${currentPage}&limit=${itemsPerPage}`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid data format: 'products' is not an array");
      }
      setProducts(data.products);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProducts([]);
    }
  }, [search, currentPage]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete product");
        fetchProducts();
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearch("");
  };

  return (
    <div className="container mx-auto p-6">
      <style jsx>{`
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        .product-card {
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          min-height: 500px;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        .image-container {
          width: 100%;
          height: 300px;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .product-content {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .product-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }
        .product-description {
          font-size: 1rem;
          color: #718096;
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .product-price {
          font-size: 1.25rem;
          font-weight: 600;
          color: #38a169;
        }
        .product-actions {
          padding: 1rem 1.5rem;
          display: flex;
          gap: 0.75rem;
          border-top: 1px solid #e2e8f0;
        }
        .btn {
          padding: 0.65rem 1.25rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          text-decoration: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          border: none;
          cursor: pointer;
        }
        .btn-view {
          background: linear-gradient(135deg, #4299e1, #3182ce);
          color: white;
        }
        .btn-view:hover {
          background: linear-gradient(135deg, #2b6cb0, #2c5282);
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(66, 153, 225, 0.3);
        }
        .btn-edit {
          background: linear-gradient(135deg, #f6e05e, #ecc94b);
          color: #1a202c;
        }
        .btn-edit:hover {
          background: linear-gradient(135deg, #f6d743, #e0c239);
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(236, 201, 75, 0.3);
        }
        .btn-delete {
          background-color: #e53e3e;
          color: white;
        }
        .btn-delete:hover {
          background-color: #c53030;
          transform: scale(1.05);
          box-shadow: 0 4px 10px rgba(229, 62, 62, 0.3);
        }
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
          gap: 0.5rem;
        }
        .page-btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          transition: background-color 0.3s ease, transform 0.1s ease;
        }
        .page-btn-active {
          background-color: #3182ce;
          color: white;
        }
        .page-btn-inactive {
          background-color: #edf2f7;
          color: #4a5568;
        }
        .page-btn:hover {
          transform: scale(1.05);
        }
        .error-message {
          color: #e53e3e;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 500;
        }
        .no-products {
          color: #718096;
          text-align: center;
          grid-column: 1 / -1;
          font-size: 1.25rem;
        }
      `}</style>

      {error && <p className="error-message">{error}</p>}
      <div className="product-grid">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="image-container">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={300}
                    className="object-contain"
                  />
                )}
              </div>
              <div className="product-content">
                <h2 className="product-title">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">${product.price}</p>
              </div>
              <div className="product-actions">
                <button
                  onClick={() => router.push(`/products/${product._id}`)}
                  className="btn btn-view"
                >
                  View
                </button>
                {session && (
                  <>
                    <button
                      onClick={() => router.push(`/products/edit/${product._id}`)}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`page-btn ${
                currentPage === page ? "page-btn-active" : "page-btn-inactive"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
