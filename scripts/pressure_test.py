import asyncio
import aiohttp
import time
import sys

async def simulate_pressure(url, requests=100):
    """Simulate pressure to test rate limiting and security filters"""
    print(f"Starting pressure simulation on {url} with {requests} requests...")
    
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(requests):
            # Mix regular requests with some suspicious patterns to test NoSQL injection detector
            target_url = url
            if i % 10 == 0:
                target_url += "?filter={$gt:''}"
            
            tasks.append(session.get(target_url))
        
        start_time = time.time()
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        end_time = time.time()
        
        stats = {
            "success": 0,
            "rate_limited": 0,
            "blocked_injection": 0,
            "other_error": 0
        }
        
        for resp in responses:
            if isinstance(resp, aiohttp.ClientResponse):
                if resp.status == 200:
                    stats["success"] += 1
                elif resp.status == 429:
                    stats["rate_limited"] += 1
                elif resp.status == 400:
                    stats["blocked_injection"] += 1
                else:
                    stats["other_error"] += 1
            else:
                stats["other_error"] += 1
        
        print("\n--- Simulation Results ---")
        print(f"Total Time: {end_time - start_time:.2f}s")
        print(f"Successful Requests: {stats['success']}")
        print(f"Rate Limited (429): {stats['rate_limited']}")
        print(f"Blocked Injection (400): {stats['blocked_injection']}")
        print(f"Other Errors: {stats['other_error']}")
        print("--------------------------")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000/health"
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 100
    asyncio.run(simulate_pressure(target, count))
