import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ChevronLeft,
  Settings,
  Lock,
  Copy,
  Eye,
  Key,
  Sparkles,
  Download,
  Plus,
} from 'lucide-react';

import { copyToClipboard } from '@/utils/copy-to-clipboard';

type Address = {
  label: string;
  address: string;
  privateKey: string;
};

type Keystore = {
  name: string;
  addresses: Address[];
};

export default function Component() {
  const [keystores, setKeystores] = useState<Keystore[]>([
    {
      name: 'Main Keystore',
      addresses: [
        {
          label: 'Primary',
          address: '0x1234...7890',
          privateKey: 'abcdef1234567890',
        },
        {
          label: 'Savings',
          address: '0x2345...8901',
          privateKey: 'bcdef1234567890a',
        },
      ],
    },
    {
      name: 'DeFi Keystore',
      addresses: [
        {
          label: 'Trading',
          address: '0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5',
          privateKey: 'cdef1234567890ab',
        },
        {
          label: 'Yield Farming',
          address: '0x3456...9012',
          privateKey: 'def1234567890abc',
        },
        {
          label: 'Liquidity Pool',
          address: '0x4567...0123',
          privateKey: 'ef1234567890abcd',
        },
      ],
    },
  ]);

  const [selectedKeystore, setSelectedKeystore] = useState<Keystore | null>(
    null
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addAddressStep, setAddAddressStep] = useState<
    'select' | 'new' | 'vanity' | 'import'
  >('select');
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    privateKey: '',
  });
  const [vanityOptions, setVanityOptions] = useState({
    startWith: '',
    endWith: '',
  });
  const [isAddingKeystore, setIsAddingKeystore] = useState(false);
  const [newKeystoreName, setNewKeystoreName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedAddressForPrivateKey, setSelectedAddressForPrivateKey] =
    useState<Address | null>(null);

  const handleKeystoreClick = (keystore: Keystore) => {
    setSelectedKeystore(keystore);
  };

  const handleBackClick = () => {
    if (isAddingAddress) {
      if (addAddressStep === 'select') {
        setIsAddingAddress(false);
      } else {
        setAddAddressStep('select');
      }
    } else {
      setSelectedKeystore(null);
    }
  };

  const handleAddAddress = () => {
    if (selectedKeystore && newAddress.label) {
      let address: Address;
      switch (addAddressStep) {
        case 'new':
          address = {
            label: newAddress.label,
            address:
              '0x' +
              Array(40)
                .fill(0)
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join(''),
            privateKey: Array(64)
              .fill(0)
              .map(() => Math.floor(Math.random() * 16).toString(16))
              .join(''),
          };
          break;
        case 'vanity':
          address = {
            label: newAddress.label,
            address:
              '0x' +
              vanityOptions.startWith +
              Array(
                38 -
                  vanityOptions.startWith.length -
                  vanityOptions.endWith.length
              )
                .fill(0)
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join('') +
              vanityOptions.endWith,
            privateKey: Array(64)
              .fill(0)
              .map(() => Math.floor(Math.random() * 16).toString(16))
              .join(''),
          };
          break;
        case 'import':
          address = {
            label: newAddress.label,
            address: '0x' + newAddress.privateKey.slice(-40),
            privateKey: newAddress.privateKey,
          };
          break;
        default:
          return;
      }

      const updatedKeystores = keystores.map((keystore) =>
        keystore.name === selectedKeystore.name
          ? { ...keystore, addresses: [...keystore.addresses, address] }
          : keystore
      );
      setKeystores(updatedKeystores);
      setSelectedKeystore(
        updatedKeystores.find((k) => k.name === selectedKeystore.name) || null
      );
      setNewAddress({ label: '', address: '', privateKey: '' });
      setVanityOptions({ startWith: '', endWith: '' });
      setIsAddingAddress(false);
      setAddAddressStep('select');
    }
  };

  const handleAddKeystore = () => {
    if (newKeystoreName) {
      setKeystores([...keystores, { name: newKeystoreName, addresses: [] }]);
      setNewKeystoreName('');
      setIsAddingKeystore(false);
    }
  };

  const handleViewPrivateKey = (address: Address) => {
    setSelectedAddressForPrivateKey(address);
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = () => {
    // In a real app, you would verify the password here
    if (password === 'password') {
      setIsPasswordDialogOpen(false);
      setPassword('');
    } else {
      // Show an error message
      alert('Incorrect password');
    }
  };

  const renderAddAddressContent = () => {
    switch (addAddressStep) {
      case 'select':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setAddAddressStep('new')}
              >
                <Key className="h-6 w-6" />
                <span>New</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setAddAddressStep('vanity')}
              >
                <Sparkles className="h-6 w-6" />
                <span>Vanity</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 space-y-2"
                onClick={() => setAddAddressStep('import')}
              >
                <Download className="h-6 w-6" />
                <span>Import</span>
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsAddingAddress(false)}
            >
              Cancel
            </Button>
          </div>
        );
      case 'new':
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="newAddressLabel"
                className="block text-sm font-medium text-gray-700"
              >
                Address Label
              </label>
              <Input
                id="newAddressLabel"
                placeholder="e.g., My New Address"
                value={newAddress.label}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, label: e.target.value })
                }
              />
            </div>
            <Button className="w-full" onClick={handleAddAddress}>
              Create Address
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setAddAddressStep('select')}
            >
              Cancel
            </Button>
          </div>
        );
      case 'vanity':
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="startWith"
                className="block text-sm font-medium text-gray-700"
              >
                Start With
              </label>
              <Input
                id="startWith"
                placeholder="e.g., 1234"
                value={vanityOptions.startWith}
                onChange={(e) =>
                  setVanityOptions({
                    ...vanityOptions,
                    startWith: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label
                htmlFor="endWith"
                className="block text-sm font-medium text-gray-700"
              >
                End With
              </label>
              <Input
                id="endWith"
                placeholder="e.g., abcd"
                value={vanityOptions.endWith}
                onChange={(e) =>
                  setVanityOptions({
                    ...vanityOptions,
                    endWith: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label
                htmlFor="vanityAddressLabel"
                className="block text-sm font-medium text-gray-700"
              >
                Address Label
              </label>
              <Input
                id="vanityAddressLabel"
                placeholder="e.g., My Vanity Address"
                value={newAddress.label}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, label: e.target.value })
                }
              />
            </div>
            <Button className="w-full" onClick={handleAddAddress}>
              Create Vanity Address
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setAddAddressStep('select')}
            >
              Cancel
            </Button>
          </div>
        );
      case 'import':
        return (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="privateKey"
                className="block text-sm font-medium text-gray-700"
              >
                Private Key
              </label>
              <Input
                id="privateKey"
                type="password"
                placeholder="Enter your private key"
                value={newAddress.privateKey}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, privateKey: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="importAddressLabel"
                className="block text-sm font-medium text-gray-700"
              >
                Address Label
              </label>
              <Input
                id="importAddressLabel"
                placeholder="e.g., Imported Address"
                value={newAddress.label}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, label: e.target.value })
                }
              />
            </div>
            <Button className="w-full" onClick={handleAddAddress}>
              Import Address
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setAddAddressStep('select')}
            >
              Cancel
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="bg-background text-foreground shadow-lg rounded-lg overflow-hidden flex flex-col w-[400px] h-[400px]">
      <Header />
      <ScrollArea className="flex-grow">
        {selectedKeystore ? (
          <KeystoreView
            selectedKeystore={selectedKeystore}
            isAddingAddress={isAddingAddress}
            handleBackClick={handleBackClick}
            renderAddAddressContent={renderAddAddressContent}
            handleViewPrivateKey={handleViewPrivateKey}
          />
        ) : (
          <KeystoreList
            keystores={keystores}
            handleKeystoreClick={handleKeystoreClick}
            isAddingKeystore={isAddingKeystore}
            newKeystoreName={newKeystoreName}
            setNewKeystoreName={setNewKeystoreName}
            handleAddKeystore={handleAddKeystore}
            setIsAddingKeystore={setIsAddingKeystore}
          />
        )}
      </ScrollArea>
      <Footer
        selectedKeystore={selectedKeystore}
        setIsAddingAddress={setIsAddingAddress}
        setIsAddingKeystore={setIsAddingKeystore}
      />
      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        setIsOpen={setIsPasswordDialogOpen}
        password={password}
        setPassword={setPassword}
        handlePasswordSubmit={handlePasswordSubmit}
      />
      <PrivateKeyDialog
        selectedAddress={selectedAddressForPrivateKey}
        setSelectedAddress={setSelectedAddressForPrivateKey}
      />
    </div>
  );
}

function Header() {
  return (
    <div className="h-[60px] bg-muted flex justify-between items-center px-4">
      <h1 className="text-lg font-semibold">Cast Wallet</h1>
      <div className="flex space-x-2">
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}

function KeystoreView({
  selectedKeystore,
  isAddingAddress,
  handleBackClick,
  renderAddAddressContent,
  handleViewPrivateKey,
}) {
  return (
    <div className="p-4">
      <Button variant="ghost" onClick={handleBackClick} className="mb-4 pl-0">
        <ChevronLeft className="h-5 w-5 mr-1" />
        <span className="text-sm">
          {isAddingAddress ? 'Add New Address' : selectedKeystore.name}
        </span>
      </Button>
      {isAddingAddress ? (
        renderAddAddressContent()
      ) : (
        <AddressList
          addresses={selectedKeystore.addresses}
          handleViewPrivateKey={handleViewPrivateKey}
        />
      )}
    </div>
  );
}

function AddressList({ addresses, handleViewPrivateKey }) {
  return (
    <>
      {addresses.map((address, index) => (
        <div key={index} className="mb-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-sm">{address.label}</div>
              <div className="text-xs text-muted-foreground">
                {address.address}
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(address.address)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleViewPrivateKey(address)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {index < addresses.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </>
  );
}

function KeystoreList({
  keystores,
  handleKeystoreClick,
  isAddingKeystore,
  newKeystoreName,
  setNewKeystoreName,
  handleAddKeystore,
  setIsAddingKeystore,
}) {
  return (
    <div className="p-4">
      {keystores.map((keystore, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <Button
            variant="ghost"
            className="w-full justify-between text-left font-normal"
            onClick={() => handleKeystoreClick(keystore)}
          >
            <span className="text-sm">{keystore.name}</span>
            <span className="text-xs text-muted-foreground">
              {keystore.addresses.length} addresses
            </span>
          </Button>
          <Separator className="my-2" />
        </div>
      ))}
      {isAddingKeystore && (
        <AddKeystoreForm
          newKeystoreName={newKeystoreName}
          setNewKeystoreName={setNewKeystoreName}
          handleAddKeystore={handleAddKeystore}
          setIsAddingKeystore={setIsAddingKeystore}
        />
      )}
    </div>
  );
}

function AddKeystoreForm({
  newKeystoreName,
  setNewKeystoreName,
  handleAddKeystore,
  setIsAddingKeystore,
}) {
  return (
    <div className="space-y-4 mt-4">
      <Input
        placeholder="New Keystore Name"
        value={newKeystoreName}
        onChange={(e) => setNewKeystoreName(e.target.value)}
      />
      <Button onClick={handleAddKeystore} className="w-full">
        Add Keystore
      </Button>
      <Button
        variant="outline"
        onClick={() => setIsAddingKeystore(false)}
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  );
}

function Footer({ selectedKeystore, setIsAddingAddress, setIsAddingKeystore }) {
  return (
    <div className="p-4 border-t">
      {selectedKeystore ? (
        <Button
          className="w-full text-sm"
          onClick={() => setIsAddingAddress(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      ) : (
        <Button
          className="w-full text-sm"
          onClick={() => setIsAddingKeystore(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Group
        </Button>
      )}
    </div>
  );
}

function PasswordDialog({
  isOpen,
  setIsOpen,
  password,
  setPassword,
  handlePasswordSubmit,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Password</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handlePasswordSubmit}>View Private Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PrivateKeyDialog({ selectedAddress, setSelectedAddress }) {
  return (
    selectedAddress && (
      <Dialog open={true} onOpenChange={() => setSelectedAddress(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Private Key</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono break-all">
                {selectedAddress.privateKey}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(selectedAddress.privateKey)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
