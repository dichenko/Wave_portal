// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract WavePortal {
    uint256 totalWaves;
    uint256 private seed;
    uint256 prizeAmount = 0.0001 ether;
    mapping(address => uint256) prizes;
    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        seed = (block.timestamp + block.difficulty) % 100;
    }

    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    function wave(string memory _message) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );
        lastWavedAt[msg.sender] = block.timestamp;

        totalWaves += 1;
        waves.push(Wave(msg.sender, _message, block.timestamp));
        emit NewWave(msg.sender, block.timestamp, _message);

        seed = (block.difficulty + block.timestamp + seed) % 100;
        if (
            prizes[msg.sender] < 1 &&
            prizeAmount <= address(this).balance &&
            seed <= 50
        ) {
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
            prizes[msg.sender] += 1;
        }
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        return totalWaves;
    }

    fallback() external payable {}

    receive() external payable {}
}
