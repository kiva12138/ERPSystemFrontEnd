const stations = [
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 2,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 3,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 4,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 2,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 4,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 3,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 2,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 4,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 2,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 2,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 3,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 4,
    materialUse: [
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 2,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 3,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 4,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 2,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 4,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 3,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 2,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 4,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 2,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 2,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 3,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 1,
    materialUse: [
      {
        materialId: '100004',
        materialName: '物料A',
        mount: 78
      },
      {
        materialId: '100005',
        materialName: '物料B',
        mount: 42
      },
      {
        materialId: '100006',
        materialName: '物料C',
        mount: 2
      },
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  },
  {
    id: '100001',
    name: '工位1',
    status: 4,
    materialUse: [
      {
        materialId: '100007',
        materialName: '物料D',
        mount: 99
      }
    ],
    materialOutput: [
      {
        materialId: '100007',
        materialName: '物料E',
        mount: 2
      },
      {
        materialId: '100008',
        materialName: '物料F',
        mount: 3
      }
    ]
  }
]

export default stations
