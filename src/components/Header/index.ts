import InternalHeader, { HeaderWithLogo } from "./Header";

type InternalHeaderType = typeof InternalHeader;
interface HeaderType extends InternalHeaderType {
  WithLogo: typeof HeaderWithLogo;
}

const Header = InternalHeader as HeaderType;
Header.WithLogo = HeaderWithLogo;
export default Header;
