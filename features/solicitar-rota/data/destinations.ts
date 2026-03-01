import { DestinationOption } from '../types';

export const ROUTE_OPTIONS: DestinationOption[] = [
  {
    id: 'main-gate',
    title: 'Portão principal',
    address: 'R. Passo da Pátria, 152-470 - São Domingos, Niterói - RJ, 24210-240',
    imageUri: require('../../../assets/local/porta-principal.png'),
    latitude: -22.898320,
    longitude: -43.132373,
  },
  {
    id: 'secondary-gate',
    title: 'Restaurante Universitário - Bandejão',
    address: 'R. Passo da Pátria, 152-470 - São Domingos, Niterói - RJ, 24210-240',
    imageUri: require('../../../assets/local/bandejao.png'),
    latitude: -22.89872029165262,
    longitude: -43.132198615963404,
  },
  {
    id: 'bcg-library',
    title: 'Biblioteca Central do Gragoatá (BCG)',
    address: 'R. Prof. Marcos Waldemar de Freitas Reis, s/n, Campus do Gragoatá – Niterói, RJ, 24210-201',
    imageUri: require('../../../assets/local/biblioteca-gragoata.png'),
    latitude: -22.89773,
    longitude: -43.13404,
  },
  {
    id: 'iacs',
    title: 'Instituto de Arte e Comunicação Social (IACS)',
    address: 'Rua Prof. Marcos Waldemar de Freitas Reis, s/n, Bloco A/J, São Domingos – Niterói, RJ, 24210-201',
    imageUri: require('../../../assets/local/IACS.png'),
    latitude: -22.89785,
    longitude: -43.13380,
  },
  {
    id: 'economics-faculty',
    title: 'Faculdade de Economia da UFF (Bloco F)',
    address: 'Campus do Gragoatá - Bloco F, São Domingos – Niterói, RJ, 24210-201',
    imageUri: require('../../../assets/local/bloco-f.png'),
    latitude: -22.89790,
    longitude: -43.13350,
  },
  {
    id: 'sports-center',
    title: 'Centro Esportivo / Inst. de Educação Física',
    address: 'Av. Visconde do Rio Branco, s/n, Campus do Gragoatá – Niterói, RJ, 24210-200',
    imageUri: require('../../../assets/local/centro-esportivo.png'),
    latitude: -22.89750,
    longitude: -43.13180,
  },
];
