// Remotion Studio / render entry: `npm run video` to preview, `npm run render` to export MP4
import { Composition, registerRoot } from 'remotion'
import { DEMO, ProductDemo } from './ProductDemo'
import { AD_TWO_AM, AdTwoAmSale } from './ads/TwoAmSale'

const RemotionRoot = () => (
  <>
    <Composition
      id="ProductDemo"
      component={ProductDemo}
      {...DEMO}
      defaultProps={{ brandName: 'Aireplo', color: '#22c55e' }}
    />
    {/* Meta ad #01; render with --public-dir ads/video-01-2am-sale/media */}
    <Composition id="AdTwoAmSale" component={AdTwoAmSale} {...AD_TWO_AM} />
  </>
)

registerRoot(RemotionRoot)
