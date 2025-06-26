// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title SayaMusicNFT
 * @dev قرارداد هوشمند برای توکن‌های غیرمثلی موسیقی با پشتیبانی از رویالتی
 */
contract SayaMusicNFT is ERC721URIStorage, ERC2981, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // ساختار داده برای ذخیره اطلاعات موسیقی
    struct MusicInfo {
        string title;
        string artist;
        string genre;
        uint256 mintDate;
        address creator;
    }
    
    // نگاشت از شناسه توکن به اطلاعات موسیقی
    mapping(uint256 => MusicInfo) public musicInfo;
    
    // رویدادها
    event MusicNFTMinted(uint256 indexed tokenId, address indexed creator, address indexed owner, string title);
    event RoyaltyUpdated(uint256 indexed tokenId, address receiver, uint96 feeNumerator);
    
    constructor() ERC721("Saya Music NFT", "SAYA") Ownable(msg.sender) {}
    
    /**
     * @dev ضرب کردن یک توکن NFT جدید
     * @param to آدرس دریافت‌کننده توکن
     * @param tokenURI آدرس متادیتای توکن
     * @param _title عنوان موسیقی
     * @param _artist نام هنرمند
     * @param _genre ژانر موسیقی
     * @param royaltyReceiver آدرس دریافت‌کننده رویالتی
     * @param royaltyFeeNumerator درصد رویالتی (در مقیاس 10000)
     * @return شناسه توکن جدید
     */
    function mintMusicNFT(
        address to,
        string memory tokenURI,
        string memory _title,
        string memory _artist,
        string memory _genre,
        address royaltyReceiver,
        uint96 royaltyFeeNumerator
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // تنظیم اطلاعات رویالتی (ERC2981)
        _setTokenRoyalty(newTokenId, royaltyReceiver, royaltyFeeNumerator);
        
        // ذخیره اطلاعات موسیقی
        musicInfo[newTokenId] = MusicInfo({
            title: _title,
            artist: _artist,
            genre: _genre,
            mintDate: block.timestamp,
            creator: msg.sender
        });
        
        emit MusicNFTMinted(newTokenId, msg.sender, to, _title);
        
        return newTokenId;
    }
    
    /**
     * @dev به‌روزرسانی اطلاعات رویالتی یک توکن
     * @param tokenId شناسه توکن
     * @param receiver آدرس دریافت‌کننده رویالتی
     * @param feeNumerator درصد رویالتی (در مقیاس 10000)
     */
    function updateRoyalty(uint256 tokenId, address receiver, uint96 feeNumerator) public {
        require(_isApprovedOrOwner(msg.sender, tokenId) || msg.sender == musicInfo[tokenId].creator, "Caller is not owner nor approved nor creator");
        _setTokenRoyalty(tokenId, receiver, feeNumerator);
        emit RoyaltyUpdated(tokenId, receiver, feeNumerator);
    }
    
    /**
     * @dev دریافت اطلاعات رویالتی یک توکن
     * @param tokenId شناسه توکن
     * @return receiver آدرس دریافت‌کننده رویالتی
     * @return royaltyAmount مقدار رویالتی
     */
    function getRoyaltyInfo(uint256 tokenId, uint256 salePrice) public view override returns (address receiver, uint256 royaltyAmount) {
        return super.royaltyInfo(tokenId, salePrice);
    }
    
    /**
     * @dev بازنویسی تابع supportsInterface برای پشتیبانی از ERC2981
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
