%lang starknet
from src.merkle import merkle_verify, extract_slots
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.hash import hash2
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le_felt

@external
func test_merkle_tree{pedersen_ptr : HashBuiltin*, range_check_ptr}():
    alloc_locals

    let (proof : felt*) = alloc()
    assert [proof] = 912731960250532085775841652191280559993923517807021803353411402411229233896
    assert [proof + 1] = 266379226154015542274390800691411794349632543970481612134814999218614237805
    assert [proof + 2] = 2640106979476691962801456236432430054464524414818352299156723891023338543648
    let proof_len = 3

    let expected_slots = 4
    let address_bn = 277413824096155514813427334480984202391356173819962235536683241578696690550
    let (leaf) = hash2{hash_ptr=pedersen_ptr}(address_bn, expected_slots)
    let root = 2468771697899238008736714601021513033261240055781424125272979167786238882148
    let (success) = merkle_verify(
        leaf=leaf,
        root=root,
        proof_len=proof_len,
        proof=proof
    )
    assert success = 1

    let (slots) = extract_slots(leaf, address_bn, guess=1, limit=10)
    assert expected_slots = slots

    return ()
end

@external
func test_pederson{syscall_ptr : felt*, range_check_ptr, pedersen_ptr : HashBuiltin*}():
    alloc_locals

    # 0x208555013ffe57ce0f78be91ce8b368eba6645a52bb90fed2c427617d619d03
    let address_1 = 919349281026173651277168422309802025126958895059959749480221613861176974595
    let (leaf_1) = hash2{hash_ptr=pedersen_ptr}(address_1, 4)
    assert leaf_1 = 3469404341487147528502158027622373375795297139027909329299560900597914307374

    # 0x009d02bAA050B9e8F3eb98fF0FA1eDe8e1b20D65CEae9f05E018b4d8dA3E4b7f
    let address_2 = 919349281026173651277168422309802025126958895059959749480221613861176974597
    let (leaf_2) = hash2{hash_ptr=pedersen_ptr}(address_2, 3)
    assert leaf_2 = 912731960250532085775841652191280559993923517807021803353411402411229233896

    # node
    let (le) = is_le_felt(leaf_1, leaf_2)
    local hash_node
    if le == 1 :
        let (h) = hash2{hash_ptr=pedersen_ptr}(leaf_1, leaf_2)
        hash_node = h
    else:
        let (h) = hash2{hash_ptr=pedersen_ptr}(leaf_2, leaf_1)
        hash_node = h
    end
    assert hash_node = 1345202875638274137670623856817746813691524223633179482825303686912793309431

    return ()
end

