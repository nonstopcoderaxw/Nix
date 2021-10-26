pragma solidity ^0.8.0;

// ----------------------------------------------------------------------------
// BokkyPooBah's MockRoyaltyEngineV1
//
// https://github.com/bokkypoobah/Nix
//
// SPDX-License-Identifier: MIT
//
// Enjoy. (c) BokkyPooBah / Bok Consulting Pty Ltd 2021. The MIT Licence.
// ----------------------------------------------------------------------------


interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IRoyaltyEngineV1Partial /* is IERC165 */ {
    function getRoyaltyView(address tokenAddress, uint tokenId, uint value) external view returns(address payable[] memory recipients, uint[] memory amounts);
}

contract MockRoyaltyEngineV1 is IRoyaltyEngineV1Partial {

    address payable public royaltyRecipient;

    constructor() {
        royaltyRecipient = payable(msg.sender);
    }


    function getRoyaltyView(address /*tokenAddress*/, uint /*tokenId*/, uint value) external view override returns(address payable[] memory recipients, uint[] memory amounts) {
        recipients = new address payable[](1);
        amounts = new uint256[](1);
        recipients[0] = royaltyRecipient;
        amounts[0] = value/5;
    }
}