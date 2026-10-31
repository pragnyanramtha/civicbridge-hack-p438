import sys

def optimal_bst(frequencies):
    """Return the optimal weighted cost and interval root choices.

    dp[left][right] measures levels relative to a root at level 1.
    Ascending candidate roots and strict improvement implement the tie rule.
    """
    n = len(frequencies)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + frequencies[i]

    dp = [[0] * n for _ in range(n)]
    roots = [[-1] * n for _ in range(n)]

    for length in range(1, n + 1):
        for left in range(n - length + 1):
            right = left + length - 1
            interval_weight = prefix[right + 1] - prefix[left]
            best_cost = None

            for root in range(left, right + 1):
                left_cost = dp[left][root - 1] if root > left else 0
                right_cost = dp[root + 1][right] if root < right else 0
                candidate = left_cost + right_cost + interval_weight

                if best_cost is None or candidate < best_cost:
                    best_cost = candidate
                    roots[left][right] = root

            dp[left][right] = best_cost

    return dp[0][n - 1], roots


def preorder(keys, roots):
    """Reconstruct root-left-right order from the stored DP decisions."""
    order = []

    def visit(left, right):
        if left > right:
            return
        root = roots[left][right]
        order.append(keys[root])
        visit(left, root - 1)
        visit(root + 1, right)

    visit(0, len(keys) - 1)
    return order


def evaluate_tree(roots, frequencies):
    """Apply another profile to an unchanged tree shape; root level is 1."""
    def visit(left, right, level):
        if left > right:
            return 0
        root = roots[left][right]
        return (
            frequencies[root] * level
            + visit(left, root - 1, level + 1)
            + visit(root + 1, right, level + 1)
        )

    return visit(0, len(frequencies) - 1, 1)


def main():
    # All supplied inputs satisfy the specification; no prompts or diagnostics.
    data = list(map(int, sys.stdin.buffer.read().split()))
    n = data[0]
    keys = data[1 : n + 1]
    normal = data[n + 1 : 2 * n + 1]
    peak = data[2 * n + 1 : 3 * n + 1]

    normal_cost, normal_roots = optimal_bst(normal)
    peak_cost, peak_roots = optimal_bst(peak)
    normal_at_peak = evaluate_tree(normal_roots, peak)
    peak_at_normal = evaluate_tree(peak_roots, normal)

    print("NORMAL_COST", normal_cost)
    print("NORMAL_PREORDER", *preorder(keys, normal_roots))
    print("PEAK_COST", peak_cost)
    print("PEAK_PREORDER", *preorder(keys, peak_roots))
    print("NORMAL_TREE_AT_PEAK", normal_at_peak)
    print("PEAK_TREE_AT_NORMAL", peak_at_normal)
    print("PEAK_SAVING", normal_at_peak - peak_cost)


if __name__ == "__main__":
    main()
