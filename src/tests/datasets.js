export const purchases = [
  {
    condition: "P30",
    supplier_id: 1,
    proof_code: "F0001999",
    proof_type: "FACTA",
    created_at: "2024-5-25",
    products_details: [
      {
        batch_number: "BCH20240225A",
        quantity: 11,
        unit_price: 14000000.0, // Antes: 70.000.000 → 20%
        product_id: 1,
      },
    ],
  },

  // End of February purchases — valores muy bajos
  {
    condition: "P30",
    supplier_id: 1,
    proof_code: "F0002001",
    proof_type: "FACTA",
    created_at: "2025-02-25",
    products_details: [
      {
        batch_number: "BCH20250225A",
        quantity: 1,
        unit_price: 14000000.0, // Antes: 70.000.000 → 20%
        product_id: 1,
      },
    ],
  },
  {
    condition: "P30",
    supplier_id: 2,
    proof_code: "F0002002",
    proof_type: "FACTA",
    created_at: "2025-02-27",
    products_details: [
      {
        batch_number: "BCH20250227A",
        quantity: 2,
        unit_price: 7200000.0, // Antes: 36.000.000 → 20%
        product_id: 2,
      },
    ],
  },
  {
    condition: "P60",
    supplier_id: 3,
    proof_code: "F0002003",
    proof_type: "FACTA",
    created_at: "2025-02-28",
    products_details: [
      {
        batch_number: "BCH20250228A",
        quantity: 1,
        unit_price: 16000000.0, // Antes: 80.000.000 → 20%
        product_id: 1,
      },
      {
        batch_number: "BCH20250228B",
        quantity: 1,
        unit_price: 7000000.0, // Antes: 35.000.000 → 20%
        product_id: 2,
      },
    ],
  },

  // March purchases — valores medianos
  {
    condition: "P30",
    supplier_id: 1,
    proof_code: "F0003001",
    proof_type: "FACTA",
    created_at: "2025-03-02",
    products_details: [
      {
        batch_number: "BCH20250302A",
        quantity: 1,
        unit_price: 28000000.0, // 40% del valor original
        product_id: 1,
      },
    ],
  },
  {
    condition: "P30",
    supplier_id: 2,
    proof_code: "F0003002",
    proof_type: "FACTA",
    created_at: "2025-03-05",
    products_details: [
      {
        batch_number: "BCH20250305A",
        quantity: 2,
        unit_price: 14400000.0, // 40%
        product_id: 2,
      },
    ],
  },
  {
    condition: "P60",
    supplier_id: 3,
    proof_code: "F0003003",
    proof_type: "FACTA",
    created_at: "2025-03-10",
    products_details: [
      {
        batch_number: "BCH20250310A",
        quantity: 1,
        unit_price: 32000000.0, // 40%
        product_id: 1,
      },
    ],
  },
  {
    condition: "P30",
    supplier_id: 1,
    proof_code: "F0003004",
    proof_type: "FACTA",
    created_at: "2025-03-15",
    products_details: [
      {
        batch_number: "BCH20250315A",
        quantity: 2,
        unit_price: 14000000.0, // 40%
        product_id: 2,
      },
    ],
  },
  {
    condition: "P60",
    supplier_id: 2,
    proof_code: "F0003005",
    proof_type: "FACTA",
    created_at: "2025-03-20",
    products_details: [
      {
        batch_number: "BCH20250320A",
        quantity: 1,
        unit_price: 1600000.0, // 40%
        product_id: 4,
      },
    ],
  },
  {
    condition: "P90",
    supplier_id: 3,
    proof_code: "F0003006",
    proof_type: "FACTB",
    created_at: "2025-03-25",
    products_details: [
      {
        batch_number: "BCH20250325A",
        quantity: 2,
        unit_price: 1400000.0, // 40%
        product_id: 7,
      },
    ],
  },
  {
    condition: "CTE",
    supplier_id: 4,
    proof_code: "F0003007",
    proof_type: "FACTC",
    created_at: "2025-03-28",
    products_details: [
      {
        batch_number: "BCH20250328A",
        quantity: 5,
        unit_price: 1200000.0, // 40%
        product_id: 10,
      },
    ],
  },

  // Abril y mayo (como están, precios plenos — reflejan inflación)
  {
    condition: "P30",
    supplier_id: 1,
    proof_code: "F0012345",
    proof_type: "FACTA",
    created_at: "2025-03-29",
    products_details: [
      {
        batch_number: "BCH20250401",
        quantity: 1,
        unit_price: 30000000.0,
        product_id: 1,
      },
      {
        batch_number: "BCH20250402",
        quantity: 1,
        unit_price: 25000000.0,
        product_id: 2,
      },
    ],
  },
  {
    condition: "P60",
    supplier_id: 2,
    proof_code: "F0056789",
    proof_type: "FACTA",
    created_at: "2025-04-02",
    products_details: [
      {
        batch_number: "BCH20250403",
        quantity: 3,
        unit_price: 4000000.0,
        product_id: 4,
      },
      {
        batch_number: "BCH20250404",
        quantity: 2,
        unit_price: 3000000.0,
        product_id: 5,
      },
      {
        batch_number: "BCH20250405",
        quantity: 1,
        unit_price: 5000000.0,
        product_id: 6,
      },
    ],
  },
  {
    condition: "P90",
    supplier_id: 3,
    proof_code: "F0078901",
    proof_type: "FACTB",
    created_at: "2025-04-05",
    products_details: [
      {
        batch_number: "BCH20250406",
        quantity: 2,
        unit_price: 3500000.0,
        product_id: 7,
      },
      {
        batch_number: "BCH20250407",
        quantity: 1,
        unit_price: 2000000.0,
        product_id: 8,
      },
    ],
  },
  {
    condition: "CTE",
    supplier_id: 4,
    proof_code: "F0012346",
    proof_type: "FACTC",
    created_at: "2025-04-08",
    products_details: [
      {
        batch_number: "BCH20250408",
        quantity: 5,
        unit_price: 3000000.0,
        product_id: 10,
      },
      {
        batch_number: "BCH20250409",
        quantity: 3,
        unit_price: 2250000.0,
        product_id: 11,
      },
    ],
  },
  {
    condition: "CDF",
    supplier_id: 5,
    proof_code: "RC004567",
    proof_type: "RECIB",
    created_at: "2025-04-12",
    products_details: [
      {
        batch_number: "BCH20250410",
        quantity: 1000,
        unit_price: 60.0,
        product_id: 13,
      },
      {
        batch_number: "BCH20250411",
        quantity: 500,
        unit_price: 80.0,
        product_id: 14,
      },
    ],
  },
  {
    condition: "P30",
    supplier_id: 1,
    proof_code: "F0034568",
    proof_type: "FACTA",
    created_at: "2025-04-26",
    products_details: [
      {
        batch_number: "BCH20250421",
        quantity: 1200,
        unit_price: 75.0,
        product_id: 16,
      },
      {
        batch_number: "BCH20250422",
        quantity: 800,
        unit_price: 110.0,
        product_id: 17,
      },
    ],
  },
  {
    condition: "P60",
    supplier_id: 2,
    proof_code: "F0078913",
    proof_type: "FACTM",
    created_at: "2025-04-28",
    products_details: [
      {
        batch_number: "BCH20250423",
        quantity: 600,
        unit_price: 90.0,
        product_id: 19,
      },
      {
        batch_number: "BCH20250424",
        quantity: 500,
        unit_price: 40.0,
        product_id: 20,
      },
    ],
  },
  {
    condition: "DBA",
    supplier_id: 3,
    proof_code: "F0098766",
    proof_type: "FACTE",
    created_at: "2025-04-30",
    products_details: [
      {
        batch_number: "BCH20250425",
        quantity: 150,
        unit_price: 75.0,
        product_id: 22,
      },
      {
        batch_number: "BCH20250426",
        quantity: 250,
        unit_price: 300.0,
        product_id: 23,
      },
    ],
  },
];
