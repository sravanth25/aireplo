// Remotion Studio / render entry: `npm run video` to preview, `npm run render` to export MP4
import { Composition, registerRoot } from 'remotion'
import { DEMO, ProductDemo } from './ProductDemo'

const RemotionRoot = () => (
  <Composition
    id="ProductDemo"
    component={ProductDemo}
    {...DEMO}
    defaultProps={{ brandName: 'Aireplo', color: '#22c55e' }}
  />
)

registerRoot(RemotionRoot)
