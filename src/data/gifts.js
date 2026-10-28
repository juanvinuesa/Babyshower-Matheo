// Lista de regalos del PDF "Lista de regalos – Baby shower de Matheo".
// `max` es la cantidad de personas que pueden elegir ese regalo.
// `max: null` significa sin límite (regalos originales).

export const CATEGORIES = [
  { id: 'ropa',        name: 'Ropa',                         color: '#e8a13a' },
  { id: 'higiene',     name: 'Higiene y baño',               color: '#7fb3c8' },
  { id: 'panales',     name: 'Pañales',                      color: '#d9822b' },
  { id: 'blanqueria',  name: 'Blanquería',                   color: '#9bbf7a' },
  { id: 'alimentacion',name: 'Alimentación',                 color: '#d46a5f' },
  { id: 'paseo',       name: 'Paseo y equipamiento grande',  color: '#b07d4f' },
  { id: 'originales',  name: 'Regalos originales',           color: '#c9a227' },
];

function ropa(id, name, sizes) {
  return sizes.map(([size, max]) => ({
    id: `${id}-${size}`, category: 'ropa', name, detail: SIZE_LABELS[size], max,
  }));
}

// Talles en orden: RN, 0-3, 3-6 meses
const SIZE_LABELS = { rn: 'Talle RN', '03': 'Talle 0-3 meses', '36': 'Talle 3-6 meses' };

export const GIFTS = [
  ...ropa('bodies-corta', 'Bodies manga corta de algodón', [['rn', 4], ['03', 8], ['36', 8]]),
  ...ropa('bodies-larga', 'Bodies manga larga de algodón', [['rn', 2], ['03', 4], ['36', 4]]),
  ...ropa('ositos',       'Ositos / enteritos con pie',    [['rn', 2], ['03', 4], ['36', 4]]),
  ...ropa('ranitas',      'Ranitas / pantaloncitos',       [['rn', 2], ['03', 4], ['36', 4]]),
  ...ropa('remeritas',    'Remeritas de algodón',          [['rn', 2], ['03', 3], ['36', 3]]),
  ...ropa('babitas',      'Babitas',                       [['03', 4], ['36', 4]]),

  { id: 'toallitas',     category: 'higiene', name: 'Toallitas húmedas',                   detail: 'Paquetes', max: 10 },
  { id: 'crema-cola',    category: 'higiene', name: 'Crema para la cola / anti paspaduras', max: 3 },
  { id: 'oleo',          category: 'higiene', name: 'Óleo calcáreo',                       max: 2 },
  { id: 'algodon',       category: 'higiene', name: 'Algodón',                             detail: 'Paquetes', max: 4 },
  { id: 'jabon',         category: 'higiene', name: 'Jabón líquido / shampoo de bebé',     max: 2 },
  { id: 'toallon',       category: 'higiene', name: 'Toallón con capucha',                 max: 3 },
  { id: 'banera',        category: 'higiene', name: 'Bañera',                              max: 1 },
  { id: 'termo-bano',    category: 'higiene', name: 'Termómetro de baño',                  max: 1 },
  { id: 'termo-digital', category: 'higiene', name: 'Termómetro digital',                  max: 1 },
  { id: 'aspirador',     category: 'higiene', name: 'Aspirador nasal',                     max: 1 },
  { id: 'cortaunas',     category: 'higiene', name: 'Tijerita o cortauñas de bebé',        max: 1 },
  { id: 'cepillo-pelo',  category: 'higiene', name: 'Cepillo de pelo suave',               max: 1 },
  { id: 'cambiador',     category: 'higiene', name: 'Cambiador portátil',                  max: 1 },
  { id: 'bolso',         category: 'higiene', name: 'Bolso maternal',                      max: 1 },
  { id: 'repelente',     category: 'higiene', name: 'Repelente apto bebés',                detail: 'Desde los 6 meses', max: 1 },

  { id: 'panales-rn', category: 'panales', name: 'Pañales talle RN', detail: 'Hasta 4,5 kg · dura 2-3 semanas',   max: 2 },
  { id: 'panales-p',  category: 'panales', name: 'Pañales talle P',  detail: '3-6 kg · dura 1,5-2 meses',         max: 6 },
  { id: 'panales-m',  category: 'panales', name: 'Pañales talle M',  detail: '5,5-9,5 kg · dura 2-3 meses',       max: 8 },
  { id: 'panales-g',  category: 'panales', name: 'Pañales talle G',  detail: '9-12,5 kg · dura 3 meses o más',    max: 8 },

  { id: 'sabanas',      category: 'blanqueria', name: 'Sábanas ajustables de cuna', detail: 'Juego', max: 3 },
  { id: 'mantitas',     category: 'blanqueria', name: 'Mantitas livianas de algodón', max: 3 },
  { id: 'frazadita',    category: 'blanqueria', name: 'Frazadita / manta polar',      max: 1 },
  { id: 'mosquitero',   category: 'blanqueria', name: 'Mosquitero para cuna',         max: 2 },

  { id: 'baberos',        category: 'alimentacion', name: 'Baberos',                   max: 4 },
  { id: 'crema-pezones',  category: 'alimentacion', name: 'Crema para pezones',        max: 1 },
  { id: 'almohada',       category: 'alimentacion', name: 'Almohada de lactancia',     max: 1 },
  { id: 'extractor',      category: 'alimentacion', name: 'Extractor de leche',        max: 1 },
  { id: 'mamaderas',      category: 'alimentacion', name: 'Mamaderas',                 detail: 'Por si se usan', max: 2 },
  { id: 'cepillo-mamad',  category: 'alimentacion', name: 'Cepillo para mamaderas',    max: 1 },
  { id: 'esterilizador',  category: 'alimentacion', name: 'Esterilizador',             max: 1 },
  { id: 'chupetes',       category: 'alimentacion', name: 'Chupetes',                  detail: 'Opcional · RN y 3 meses', max: 2 },

  { id: 'huevito',    category: 'paseo', name: 'Huevito / butaca para auto', detail: 'Grupo 0+', max: 1 },
  { id: 'cochecito',  category: 'paseo', name: 'Cochecito',                  max: 1 },
  { id: 'mochila',    category: 'paseo', name: 'Mochila portabebé',          max: 1 },
  { id: 'mecedora',   category: 'paseo', name: 'Sillita mecedora / bouncer', max: 1 },
  { id: 'gimnasio',   category: 'paseo', name: 'Gimnasio de piso',           max: 1 },
  { id: 'monitor',    category: 'paseo', name: 'Monitor de bebé',            max: 1 },

  { id: 'libros',      category: 'originales', name: 'Libros de tela o de cartón para bebés',          max: null },
  { id: 'apego',       category: 'originales', name: 'Juguetes de apego, mordillos y sonajeros',       max: null },
  { id: 'movil',       category: 'originales', name: 'Móvil para cuna',                                max: null },
  { id: 'huellitas',   category: 'originales', name: 'Kit de huellitas o portarretrato de recién nacido', max: null },
  { id: 'album',       category: 'originales', name: 'Álbum o libro del bebé para completar',          max: null },
  { id: 'recuerdos',   category: 'originales', name: 'Cajita de recuerdos', detail: 'Primer chupete, pulsera de la clínica, etc.', max: null },
  { id: 'personaliz',  category: 'originales', name: 'Ropa personalizada con el nombre Matheo',         max: null },
  { id: 'panales-xg',  category: 'originales', name: 'Pañales de talles grandes', detail: 'G, XG',     max: null },
  { id: 'kit-mama',    category: 'originales', name: 'Kit para mamá', detail: 'Cremas, pantuflas, camisón, corpiño de amamantar', max: null },
  { id: 'giftcard',    category: 'originales', name: 'Gift card de una casa de bebés',                 max: null },
];

export const GIFTS_BY_ID = Object.fromEntries(GIFTS.map(g => [g.id, g]));

export const TIPS = [
  'Si dudás del talle, elegí 3-6 meses: siempre se usa.',
  'Pañales de talle P, M o G nunca sobran.',
  'Guardá el ticket de cambio con el regalo.',
  'Preferí algodón y telas frescas: Matheo llega en verano.',
];
