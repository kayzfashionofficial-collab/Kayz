// src/context/CollectionsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storefrontClient } from '../lib/shopifyConfig';
import { COLLECTIONS_QUERY } from '../lib/shopifyQueries';

const CollectionsContext = createContext();

export const CollectionsProvider = ({ children }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const { data, errors } = await storefrontClient.query(COLLECTIONS_QUERY, {
        first: 10
      });

      if (errors) {
        throw new Error(errors[0].message);
      }

      setCollections(data.collections.edges.map(edge => edge.node));
    } catch (err) {
      setError(err.message);
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    collections,
    loading,
    error,
    refetchCollections: fetchCollections
  };

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};

export const useCollections = () => {
  const context = useContext(CollectionsContext);
  if (!context) {
    throw new Error('useCollections must be used within a CollectionsProvider');
  }
  return context;
};

export default CollectionsContext;