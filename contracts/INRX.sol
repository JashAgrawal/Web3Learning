pragma solidity >=0.7.0 <0.9.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";

contract INRX is ERC20 {
    constructor() public ERC20("INRPOLYGONCOIN", "INRX") {
        _mint(
            0x2994F1D4aBBef749677CE2abfBEB80A95FABE8b4,
            100000 * (10**uint256(decimals()))
        );
    }

    function transferss(
        address from,
        address to,
        uint256 amount
    ) public {
        uint256 realAmount = amount * 10**18;
        ERC20.approve(from, realAmount);
        ERC20.transferFrom(from, to, realAmount);
        ERC20.approve(to, realAmount);
    }
}
