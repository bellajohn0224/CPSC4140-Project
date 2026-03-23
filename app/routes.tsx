import { createBrowserRouter } from 'react-router';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CategorySelectionScreen } from './components/CategorySelectionScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { PlaceDetailScreen } from './components/PlaceDetailScreen';
import { QRCodeScreen } from './components/QRCodeScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: WelcomeScreen,
  },
  {
    path: '/categories',
    Component: CategorySelectionScreen,
  },
  {
    path: '/results/:categoryId',
    Component: ResultsScreen,
  },
  {
    path: '/place/:placeId',
    Component: PlaceDetailScreen,
  },
  {
    path: '/qr/:placeId',
    Component: QRCodeScreen,
  },
]);