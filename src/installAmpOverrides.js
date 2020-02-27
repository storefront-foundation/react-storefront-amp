import SwatchProductOption from 'react-storefront/option/SwatchProductOption'
import SearchSuggestionItem from 'react-storefront/search/SearchSuggestionItem'
import AmpImage from './AmpImage'
import AmpMenuBranch from './menu/AmpMenuBranch'
import MenuItem from 'react-storefront/menu/MenuItem'
import AmpMenuCard from './menu/AmpMenuCard'
import ImageMagnify from './carousel/ImageMagnify'
import MenuBody from 'react-storefront/menu/MenuBody'
import Media from 'react-storefront/carousel/Media'
import CarouselThumbnails from 'react-storefront/carousel/CarouselThumbnails'
import AmpExpandableSection from './AmpExpandableSection'

export default function installAmpOverrides() {
  CarouselThumbnails.defaultProps.ImageComponent = AmpImage
  Media.defaultProps.ImageMagnifyComponent = ImageMagnify
  Media.defaultProps.ImageComponent = AmpImage
  SwatchProductOption.defaultProps.ImageComponent = AmpImage
  SearchSuggestionItem.defaultProps.ImageComponent = AmpImage
  MenuItem.defaultProps.BranchComponent = AmpMenuBranch
  MenuBody.defaultProps.CardComponent = AmpMenuCard
  AmpMenuBranch.defaultProps.ExpanderComponent = AmpExpandableSection
}
