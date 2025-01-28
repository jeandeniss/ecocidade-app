export function generateStoreJsonLd(store: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: store.name,
    description: store.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: store.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: store.coordinates[0],
      longitude: store.coordinates[1],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: store.rating,
      reviewCount: store.reviewCount,
    },
    openingHours: Object.entries(store.openingHours).map(
      ([days, hours]) => `${days} ${hours}`
    ),
  }
}

export function generateProductJsonLd(product: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'environmentalImpactScore',
        value: product.environmentalImpact.score,
      },
      {
        '@type': 'PropertyValue',
        name: 'carbonFootprint',
        value: product.environmentalImpact.carbonFootprint,
        unitCode: 'KGM',
      },
    ],
  }
}