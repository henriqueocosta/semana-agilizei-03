/// <reference types="cypress" /> 

import {format, prepareLocalStorage} from '../support/utils'

context('Dev Finances Agilizei', () => {

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app/#', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        }
            
        );
        //cy.get('#data-table tbody tr').should('have.length', 0); 
    })

    it('Cadastrar Entradas', () => {
        cy.get('#transaction .button').click();
        cy.get('#description').type('Salário');
        cy.get('[name = amount]').type(1000);
        cy.get('[type=date').type('2021-03-17');
        cy.get('button').contains('Salvar').click();
        
        cy.get('#data-table tbody tr').should('have.length', 3);
    
    });

    it('Cadastrar Saidas', () => {
        cy.get('#transaction .button').click();
        cy.get('#description').type('Arroz');
        cy.get('[name = amount]').type(-27);
        cy.get('[type=date').type('2021-03-17');
        cy.get('button').contains('Salvar').click();
        
        cy.get('#data-table tbody tr').should('have.length', 3);
    });

    it('Remover Entradas e Saidas', () => {

        cy.get('td.description')
            .contains('Mesada')
            .parent()
            .find('img[onclick*=remove]')
            .click()

        cy.get('td.description')    
            .contains('Suco Kapo')
            .siblings()
            .find('img[onclick*=remove]')
            .click()

        cy.get('#data-table tbody tr').should('have.length', 0);

    });

    it('Validar cenário com diversas transacoes', () => {
        
        // const entrada = 'Salário';
        // const saida = 'Arroz';

        // cy.get('#transaction .button').click();
        // cy.get('#description').type(entrada);
        // cy.get('[name = amount]').type(900);
        // cy.get('[type=date').type('2021-03-17');
        // cy.get('button').contains('Salvar').click();

        
        // cy.get('#transaction .button').click();
        // cy.get('#description').type(saida);
        // cy.get('[name = amount]').type(-27);
        // cy.get('[type=date').type('2021-03-17');
        // cy.get('button').contains('Salvar').click();

        let incomes = 0
        let expenses = 0 

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {
                cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                    if(text.includes('-')){
                        expenses = expenses + format(text)
                    } else {
                        incomes = incomes + format(text)
                    }        

                    cy.log(incomes);
                    cy.log(expenses);

                })  
      
            })

            cy.get('#totalDisplay').invoke('text').then(text => {
                let formattedTotalDisplay = format(text)
                let expectedTotal = incomes + expenses

                expect(formattedTotalDisplay).to.eq(expectedTotal)
            })

    })
});