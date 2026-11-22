// Remotion Studio / render entry: `npm run video` to preview, `npm run render` to export MP4
import { Composition, registerRoot } from 'remotion'
import { DEMO, ProductDemo } from './ProductDemo'
import { AD_TWO_AM, AdTwoAmSale } from './ads/TwoAmSale'
import { AD_REAL_ESTATE, AdRealEstateLead } from './ads/RealEstateLead'
import { AD_RE_HINGLISH, AdRealEstateHinglish } from './ads/RealEstateHinglish'

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
    {/* Meta ad #02 (real estate); render with --public-dir ads/video-02-real-estate/media */}
    <Composition id="AdRealEstateLead" component={AdRealEstateLead} {...AD_REAL_ESTATE} />
    {/* Meta ad #03 (real estate, Hinglish); render with --public-dir ads/video-03-real-estate-hinglish/media */}
    <Composition id="AdRealEstateHinglish" component={AdRealEstateHinglish} {...AD_RE_HINGLISH} />
  </>
)

registerRoot(RemotionRoot)
