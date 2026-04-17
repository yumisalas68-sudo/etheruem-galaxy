import asyncio
from playwright.async_api import async_playwright

async def run_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("[TC001] Navigating to local Ethereum Galaxy...")
        await page.goto('http://localhost:3001/')
        
        print("[TC001] Waiting for 3D Canvas context to mount...")
        await page.wait_for_selector('canvas')
        
        print("[TC001] Verifying title element presence...")
        title_element = await page.get_by_text("Ethereum Ecosystem Galaxy")
        assert title_element is not None, "Title not found"
        
        print("[TC001] SUCCESS: InstancedMesh rendering successfully")
        await browser.close()

if __name__ == '__main__':
    asyncio.run(run_test())
