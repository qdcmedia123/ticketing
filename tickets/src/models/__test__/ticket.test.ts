import {Ticket} from '../ticket';

it('implements optimistic concurrency control', async(done) => {
    // Create an instace of a ticket 
    const ticket = Ticket.build({
        title: 'concert',
        price: 234,
        userId: 'abc'
    });
    // save the ticket to the database 
    await ticket.save();
    // fetch the ticket twic 
    const firstInstance = await Ticket.findById(ticket.id);
    const secoundInstance = await Ticket.findById(ticket.id);
    // make two seperate changes to the tickets we fetched 
    firstInstance!.set({price: 22});
    // save the first fetched ticket
    secoundInstance!.set({price:33})
    // save the secound fetched ticket and expect an error 
    await firstInstance!.save();
    try {
        await secoundInstance!.save();
    } catch(error) {
        return done();
    }   
    throw new Error('Could not reach to this stage.')
    
});

it("increments the version number in multiple saves", async() => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 34,
        userId: 'sdf'
    });
    

    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);

});

