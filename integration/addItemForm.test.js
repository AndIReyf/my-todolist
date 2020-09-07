describe('addItemForm', () => {
    it('base example', async () => {
        await page.goto('http://localhost:6006/iframe.html?id=add-item-form--add-item-fom-example&viewMode=story');
        const image = await page.screenshot();

        expect(image).toMatchImageSnapshot()
    });
})