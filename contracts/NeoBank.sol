pragma solidity >=0.7.0 <0.9.0;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.5.0/contracts/utils/math/SafeMath.sol";
import "./INRX.sol";

contract NeoBank is INRX {
    using SafeMath for uint256;
    using SafeMath for uint32;
    struct User {
        address userAddress;
        string privateKey;
        string nameId;
        uint32 balance;
    }
    address TokenAddress = 0x81A97675D9BB1580B1E7e176A438eF742702FD29;
    address MainAccount = 0x2994F1D4aBBef749677CE2abfBEB80A95FABE8b4;
    mapping(string => User) public nameIdToUser;
    User[] public Users;

    function AccCreation(
        address userAddress,
        string calldata privateKey,
        string calldata nameId
    ) public {
        for (uint256 i = 0; i < Users.length; i++) {
            require(
                keccak256(abi.encodePacked(Users[i].nameId)) !=
                    keccak256(abi.encodePacked(nameId))
            );
        }
        User memory newUser = User(userAddress, privateKey, nameId, 0);
        nameIdToUser[nameId] = newUser;
        Users.push(newUser);
    }

    function WithDraw(string memory nameId, uint256 amount)
        public
        returns (uint256)
    {
        uint256 Amount = amount * 10**18;
        address userAddress = nameIdToUser[nameId].userAddress;
        require(ERC20(TokenAddress).balanceOf(userAddress) >= Amount);
        ERC20.approve(userAddress, Amount);
        ERC20.transferFrom(userAddress, MainAccount, Amount);
        nameIdToUser[nameId].balance = uint32(
            nameIdToUser[nameId].balance.sub(Amount)
        );
        return ERC20(TokenAddress).balanceOf(userAddress);
    }

    function Deposit(string calldata nameId, uint256 amount)
        public
        returns (uint256)
    {
        uint256 Amount = amount * 10**18;
        address Add = nameIdToUser[nameId].userAddress;
        ERC20.approve(MainAccount, Amount);
        ERC20.transferFrom(MainAccount, Add, Amount);
        nameIdToUser[nameId].balance = uint32(
            nameIdToUser[nameId].balance.add(Amount)
        );
        return ERC20(TokenAddress).balanceOf(Add);
    }

    function TransferAmount(
        string calldata fromNameId,
        string calldata toNameId,
        uint256 amount
    ) public returns (uint256) {
        uint256 Amount = amount * 10**18;
        address fromAddress = nameIdToUser[fromNameId].userAddress;
        address toAddress = nameIdToUser[toNameId].userAddress;
        ERC20.approve(fromAddress, Amount);
        ERC20.transferFrom(fromAddress, toAddress, Amount);
        nameIdToUser[fromNameId].balance = uint32(
            nameIdToUser[fromNameId].balance.sub(Amount)
        );
        nameIdToUser[toNameId].balance = uint32(
            nameIdToUser[toNameId].balance.add(Amount)
        );
        return ERC20(TokenAddress).balanceOf(fromAddress);
    }

    function ViewUsers() public view returns (User[] memory) {
        return Users;
    }

    function GetBalance(string calldata nameId) public view returns (uint32) {
        return nameIdToUser[nameId].balance;
    }

    function getUserDetails(string calldata nameId)
        public
        view
        returns (User memory)
    {
        return nameIdToUser[nameId];
    }
}
